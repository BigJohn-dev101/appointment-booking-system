import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";

export const getBusinessProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await prisma.business.findUnique({
      where: { ownerUserId: req.user!.userId },
      select: {
        id: true,
        name: true,
        category: true,
        staffSize: true,
        email: true,
        phone: true,
        address: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Business profile not found" });
    }
    return res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Business profile fetch error:", error);
    return res.status(500).json({ success: false, message: "Unable to load business profile" });
  }
};

export const updateBusinessProfile = async (req: AuthenticatedRequest, res: Response) => {
  const allowedFields = new Set(["name", "category", "staffSize", "email", "phone", "address", "description"]);
  const body = req.body as Record<string, unknown>;
  const unsupportedField = Object.keys(body ?? {}).find((field) => !allowedFields.has(field));
  if (!body || typeof body !== "object" || Array.isArray(body) || unsupportedField) {
    return res.status(400).json({
      success: false,
      message: unsupportedField ? `Unsupported profile field: ${unsupportedField}` : "A profile object is required",
    });
  }

  const data: Record<string, string | null> = {};
  for (const field of allowedFields) {
    if (!Object.hasOwn(body, field)) continue;
    const value = body[field];
    if (value !== null && typeof value !== "string") {
      return res.status(400).json({ success: false, message: `${field} must be a string or null` });
    }
    if (typeof value === "string" && value.trim().length > (field === "description" ? 2000 : 200)) {
      return res.status(400).json({ success: false, message: `${field} is too long` });
    }
    data[field] = typeof value === "string" ? value.trim() || null : null;
  }
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ success: false, message: "At least one profile field must be provided" });
  }
  if (data.name === null) {
    return res.status(400).json({ success: false, message: "Business name cannot be empty" });
  }

  try {
    const result = await prisma.business.updateMany({
      where: { ownerUserId: req.user!.userId },
      data,
    });
    if (result.count === 0) {
      return res.status(404).json({ success: false, message: "Business profile not found" });
    }

    const profile = await prisma.business.findUnique({
      where: { ownerUserId: req.user!.userId },
      select: {
        id: true,
        name: true,
        category: true,
        staffSize: true,
        email: true,
        phone: true,
        address: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.status(200).json({ success: true, profile });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return res.status(409).json({ success: false, message: "That business phone number is already in use" });
    }
    console.error("Business profile update error:", error);
    return res.status(500).json({ success: false, message: "Unable to update business profile" });
  }
};

export const getBusinessDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const business = await prisma.business.findUnique({
      where: { ownerUserId: req.user.userId },
    });

    if (!business) {
      return res.status(404).json({ success: false, message: "Business profile not found" });
    }

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [
      todayAppointments,
      todayRemaining,
      staffCount,
      activeServicesCount,
      monthAppointments,
      todayAppointmentsList,
      staffList,
      activeSubscription,
    ] = await Promise.all([
      prisma.appointment.count({
        where: { businessId: business.id, scheduledStart: { gte: startOfToday, lt: startOfTomorrow } },
      }),
      prisma.appointment.count({
        where: {
          businessId: business.id,
          scheduledStart: { gte: now, lt: startOfTomorrow },
          status: "CONFIRMED",
        },
      }),
      prisma.businessStaff.count({ where: { businessId: business.id } }),
      prisma.service.count({ where: { businessId: business.id, active: true } }),
      prisma.appointment.count({
        where: { businessId: business.id, scheduledStart: { gte: startOfMonth, lt: startOfNextMonth } },
      }),
      prisma.appointment.findMany({
        where: { businessId: business.id, scheduledStart: { gte: startOfToday, lt: startOfTomorrow } },
        orderBy: { scheduledStart: "asc" },
        include: {
          customer: { select: { firstName: true, lastName: true } },
          service: { select: { name: true } },
          staff: { include: { user: { select: { firstName: true, lastName: true } } } },
        },
      }),
      prisma.businessStaff.findMany({
        where: { businessId: business.id },
        include: {
          user: { select: { firstName: true, lastName: true } },
          services: { include: { service: { select: { name: true } } } },
          appointments: {
            where: { scheduledStart: { gte: startOfToday, lt: startOfTomorrow } },
            select: {
              id: true,
              scheduledStart: true,
              status: true,
              service: { select: { durationMinutes: true } },
            },
          },
        },
      }),
      prisma.providerSubscription.findFirst({
        where: { businessId: business.id, status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        include: { package: true },
      }),
    ]);

    const staff = staffList.map((member) => {
      const isBusyNow = member.appointments.some((appt) => {
        if (appt.status !== "CONFIRMED") return false;
        const start = appt.scheduledStart.getTime();
        const end = start + appt.service.durationMinutes * 60_000;
        return now.getTime() >= start && now.getTime() < end;
      });

      return {
        id: member.id,
        // NOTE: no `title`/`role` column on BusinessStaff yet — using first
        // assigned service as a stand-in. Add a real field if you need this.
        name: `${member.user.firstName} ${member.user.lastName ?? ""}`.trim(),
        role: member.services[0]?.service.name ?? "Staff",
        appointmentsToday: member.appointments.length,
        status: isBusyNow ? "Busy" : "Available",
      };
    });

    return res.status(200).json({
      success: true,
      business: {
        id: business.id,
        name: business.name,
        category: business.category,
        staffSize: business.staffSize,
        email: business.email,
        phone: business.phone,
        address: business.address,
      },
      stats: {
        todayAppointments,
        todayRemaining,
        staffCount,
        maxStaff: activeSubscription?.maxStaff ?? activeSubscription?.package.maxStaff ?? null,
        activeServicesCount,
        monthAppointments,
      },
      todayAppointments: todayAppointmentsList.map((a) => ({
        id: a.id,
        time: a.scheduledStart,
        customerName: `${a.customer.firstName} ${a.customer.lastName ?? ""}`.trim(),
        service: a.service.name,
        staffName: a.staff ? `${a.staff.user.firstName} ${a.staff.user.lastName ?? ""}`.trim() : null,
        status: a.status,
      })),
      staff,
      subscription: activeSubscription
        ? {
            tier: activeSubscription.package.tier,
            status: activeSubscription.status,
            paymentStatus: activeSubscription.paymentStatus,
            maxStaff: activeSubscription.maxStaff ?? activeSubscription.package.maxStaff,
            dailyAppointmentLimit:
              activeSubscription.dailyAppointmentLimit ?? activeSubscription.package.dailyAppointmentLimit,
            nextBillingDate: activeSubscription.nextBillingDate,
          }
        : null,
    });
  } catch (error) {
    console.error("Business dashboard error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong while loading the dashboard" });
  }
};