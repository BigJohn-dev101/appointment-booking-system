import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";

const getSoleProvider = async (userId: string) =>
  prisma.soleProvider.findUnique({ where: { userId }, select: { id: true } });

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

export const getProviderServices = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const provider = await getSoleProvider(req.user.userId);
    if (!provider) {
      return res.status(404).json({ success: false, message: "Sole provider profile not found" });
    }

    const services = await prisma.service.findMany({
      where: { soleProviderId: provider.id },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(services.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      duration: service.durationMinutes,
      price: service.expectedPrice === null ? 0 : Number(service.expectedPrice),
    })));
  } catch (error) {
    console.error("Provider services fetch failed:", error);
    return res.status(500).json({ success: false, message: "Unable to load services" });
  }
};

export const createProviderService = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const { name, description, duration, price } = req.body as {
      name?: unknown;
      description?: unknown;
      duration?: unknown;
      price?: unknown;
    };

    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.trim().length > 100 ||
      (description !== undefined && typeof description !== "string") ||
      (typeof description === "string" && description.length > 500) ||
      typeof duration !== "number" ||
      !Number.isInteger(duration) ||
      duration < 5 ||
      duration > 1440 ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return res.status(400).json({ success: false, message: "Please provide valid service details" });
    }

    const provider = await getSoleProvider(req.user.userId);
    if (!provider) {
      return res.status(404).json({ success: false, message: "Sole provider profile not found" });
    }

    const service = await prisma.service.create({
      data: {
        soleProviderId: provider.id,
        name: name.trim(),
        description: typeof description === "string" && description.trim() ? description.trim() : null,
        durationMinutes: duration,
        expectedPrice: price,
      },
    });

    return res.status(201).json({
      id: service.id,
      name: service.name,
      description: service.description,
      duration: service.durationMinutes,
      price: service.expectedPrice === null ? 0 : Number(service.expectedPrice),
    });
  } catch (error) {
    console.error("Provider service creation failed:", error);
    return res.status(500).json({ success: false, message: "Unable to create service" });
  }
};

export const deleteProviderService = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const serviceId = req.params.id;
    if (typeof serviceId !== "string") {
      return res.status(400).json({ success: false, message: "Invalid service ID" });
    }

    const provider = await getSoleProvider(req.user.userId);
    if (!provider) {
      return res.status(404).json({ success: false, message: "Sole provider profile not found" });
    }

    const result = await prisma.service.deleteMany({
      where: { id: serviceId, soleProviderId: provider.id },
    });
    if (result.count === 0) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Provider service deletion failed:", error);
    return res.status(500).json({ success: false, message: "Unable to delete service" });
  }
};

export const getProviderAppointments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const status = req.query.status;
    const statusFilter =
      status === "UPCOMING"
        ? ["CONFIRMED", "RESCHEDULED"] as const
        : status === "COMPLETED"
          ? ["COMPLETED"] as const
          : status === "CANCELLED"
            ? ["CANCELLED"] as const
            : null;

    if (!statusFilter) {
      return res.status(400).json({ success: false, message: "Invalid appointment status filter" });
    }

    const provider = await getSoleProvider(req.user.userId);
    if (!provider) {
      return res.status(404).json({ success: false, message: "Sole provider profile not found" });
    }

    const appointments = await prisma.appointment.findMany({
      where: { soleProviderId: provider.id, status: { in: [...statusFilter] } },
      orderBy: { scheduledStart: status === "UPCOMING" ? "asc" : "desc" },
      include: {
        customer: { select: { firstName: true, lastName: true, email: true } },
        service: { select: { name: true } },
      },
    });

    return res.status(200).json(appointments.map((appointment) => ({
      id: appointment.id,
      customerName: `${appointment.customer.firstName} ${appointment.customer.lastName ?? ""}`.trim(),
      customerEmail: appointment.customer.email,
      serviceName: appointment.service.name,
      date: appointment.scheduledStart,
      status: ["CONFIRMED", "RESCHEDULED"].includes(appointment.status) ? "UPCOMING" : appointment.status,
    })));
  } catch (error) {
    console.error("Provider appointments fetch failed:", error);
    return res.status(500).json({ success: false, message: "Unable to load appointments" });
  }
};

export const updateProviderAppointmentStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const { status } = req.body as { status?: unknown };
    if (status !== "COMPLETED" && status !== "CANCELLED") {
      return res.status(400).json({ success: false, message: "Invalid appointment status" });
    }

    const appointmentId = req.params.id;
    if (typeof appointmentId !== "string") {
      return res.status(400).json({ success: false, message: "Invalid appointment ID" });
    }

    const provider = await getSoleProvider(req.user.userId);
    if (!provider) {
      return res.status(404).json({ success: false, message: "Sole provider profile not found" });
    }

    const updated = await prisma.appointment.updateMany({
      where: {
        id: appointmentId,
        soleProviderId: provider.id,
        status: { in: ["CONFIRMED", "RESCHEDULED"] },
      },
      data: { status },
    });
    if (updated.count === 0) {
      return res.status(404).json({ success: false, message: "Upcoming appointment not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Provider appointment status update failed:", error);
    return res.status(500).json({ success: false, message: "Unable to update appointment" });
  }
};