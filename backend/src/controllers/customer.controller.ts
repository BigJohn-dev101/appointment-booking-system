import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";

export const getCustomerDashboard = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const [stats, upcomingAppointments] = await Promise.all([
      prisma.appointment.groupBy({
        by: ["status"],
        where: { customerId: req.user.userId },
        _count: { _all: true },
      }),
      prisma.appointment.findMany({
        where: {
          customerId: req.user.userId,
          scheduledStart: { gte: now },
          status: { in: ["CONFIRMED", "RESCHEDULED"] },
        },
        orderBy: { scheduledStart: "asc" },
        take: 5,
        include: {
          service: { select: { name: true } },
          soleProvider: { select: { displayName: true } },
          business: { select: { name: true } },
        },
      }),
    ]);

    const countByStatus = Object.fromEntries(
      stats.map((entry) => [entry.status, entry._count._all]),
    ) as Record<string, number>;

    return res.status(200).json({
      success: true,
      stats: {
        upcomingAppointments:
          (countByStatus.CONFIRMED ?? 0) + (countByStatus.RESCHEDULED ?? 0),
        todayAppointments: await prisma.appointment.count({
          where: {
            customerId: req.user.userId,
            scheduledStart: { gte: startOfToday, lt: startOfTomorrow },
          },
        }),
        completedAppointments: countByStatus.COMPLETED ?? 0,
        cancelledAppointments: countByStatus.CANCELLED ?? 0,
      },
      upcomingAppointments: upcomingAppointments.map((appointment) => ({
        id: appointment.id,
        time: appointment.scheduledStart,
        service: appointment.service.name,
        providerName:
          appointment.soleProvider?.displayName ??
          appointment.business?.name ??
          "Provider",
        status: appointment.status,
      })),
    });
  } catch (error) {
    console.error("Customer dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while loading the dashboard",
    });
  }
};

export const getCustomerAppointments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const now = new Date();

    const [upcoming, past] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          customerId: req.user.userId,
          scheduledStart: { gte: now },
          status: { in: ["CONFIRMED", "RESCHEDULED"] },
        },
        orderBy: { scheduledStart: "asc" },
        include: {
          service: { select: { name: true } },
          soleProvider: { select: { displayName: true } },
          business: { select: { name: true } },
        },
      }),
      prisma.appointment.findMany({
        where: {
          customerId: req.user.userId,
          OR: [{ scheduledStart: { lt: now } }, { status: { in: ["COMPLETED", "CANCELLED", "NO_SHOW"] } }],
        },
        orderBy: { scheduledStart: "desc" },
        take: 10,
        include: {
          service: { select: { name: true } },
          soleProvider: { select: { displayName: true } },
          business: { select: { name: true } },
        },
      }),
    ]);

    const format = (a: (typeof upcoming)[number]) => ({
      id: a.id,
      time: a.scheduledStart,
      service: a.service.name,
      providerName: a.soleProvider?.displayName ?? a.business?.name ?? "Provider",
      status: a.status,
    });

    return res.status(200).json({
      success: true,
      upcoming: upcoming.map(format),
      past: past.map(format),
    });
  } catch (error) {
    console.error("Customer appointments error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong while loading your appointments" });
  }
};