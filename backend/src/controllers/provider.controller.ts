import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";

export const getProviderDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const soleProvider = await prisma.soleProvider.findUnique({
      where: { userId: req.user.userId },
    });

    if (!soleProvider) {
      return res.status(404).json({ success: false, message: "Sole provider profile not found" });
    }

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const [
      todayBookings,
      upcomingBookings,
      completedBookings,
      cancelledBookings,
      upcomingAppointments,
      activeSubscription,
    ] = await Promise.all([
      prisma.appointment.count({
        where: {
          soleProviderId: soleProvider.id,
          scheduledStart: { gte: startOfToday, lt: startOfTomorrow },
        },
      }),
      prisma.appointment.count({
        where: { soleProviderId: soleProvider.id, scheduledStart: { gte: now }, status: "CONFIRMED" },
      }),
      prisma.appointment.count({
        where: { soleProviderId: soleProvider.id, status: "COMPLETED" },
      }),
      prisma.appointment.count({
        where: { soleProviderId: soleProvider.id, status: "CANCELLED" },
      }),
      prisma.appointment.findMany({
        where: { soleProviderId: soleProvider.id, scheduledStart: { gte: now }, status: "CONFIRMED" },
        orderBy: { scheduledStart: "asc" },
        take: 5,
        include: {
          customer: { select: { firstName: true, lastName: true } },
          service: { select: { name: true } },
        },
      }),
      prisma.providerSubscription.findFirst({
        where: { soleProviderId: soleProvider.id, status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        include: { package: true },
      }),
    ]);

    return res.status(200).json({
      success: true,
      stats: { todayBookings, upcomingBookings, completedBookings, cancelledBookings },
      upcomingAppointments: upcomingAppointments.map((a) => ({
        id: a.id,
        time: a.scheduledStart,
        customerName: `${a.customer.firstName} ${a.customer.lastName ?? ""}`.trim(),
        service: a.service.name,
        status: a.status,
      })),
      subscription: activeSubscription
        ? {
            tier: activeSubscription.package.tier,
            status: activeSubscription.status,
            paymentStatus: activeSubscription.paymentStatus,
            dailyAppointmentLimit:
              activeSubscription.dailyAppointmentLimit ?? activeSubscription.package.dailyAppointmentLimit,
            monthlyPrice: activeSubscription.package.monthlyPrice,
            nextBillingDate: activeSubscription.nextBillingDate,
          }
        : null,
    });
  } catch (error) {
    console.error("Provider dashboard error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong while loading the dashboard" });
  }
};