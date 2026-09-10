import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const registerCustomer = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      agree,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required",
      });
    }

    // Check terms
    if (!agree) {
      return res.status(400).json({
        success: false,
        message: "You must accept the terms and privacy policy",
      });
    }

    // Check passwords
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Check whether email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Split full name
    const nameParts = fullName.trim().split(/\s+/);

    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || null;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create customer
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        firstName,
        lastName,
        phone: phone?.trim() || null,
        role: "CUSTOMER",
        termsAcceptedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Customer account created successfully",
      user,
    });
  } catch (error) {
    console.error("Customer registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the account",
    });
  }
};

export const login = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    // Don't reveal whether the email exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Make sure JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration error",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging in",
    });
  }
};

export const getMe = async (
  req: Request,
  res: Response,
) => {
  try {
    const authReq = req as Request & {
      user?: {
        userId: string;
        role: string;
      };
    };

    if (!authReq.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: authReq.user.userId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


export const registerProvider = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      fullName,
      serviceName,
      email,
      phone,
      city,
      category,
      experience,
      bio,
      password,
      confirmPassword,
      packageTier,
      agree,
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !serviceName ||
      !email ||
      !password ||
      !confirmPassword ||
      !packageTier
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, service name, email, password and package are required",
      });
    }

    // Check terms
    if (!agree) {
      return res.status(400).json({
        success: false,
        message:
          "You must accept the provider agreement, terms and privacy policy",
      });
    }

    // Check passwords
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Validate package
    if (!["BASIC", "GROWTH"].includes(packageTier)) {
      return res.status(400).json({
        success: false,
        message: "Invalid provider package",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check whether email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Find the selected sole provider package
    const selectedPackage = await prisma.package.findUnique({
      where: {
        providerType_tier: {
          providerType: "SOLE_PROVIDER",
          tier: packageTier,
        },
      },
    });

    if (!selectedPackage) {
      return res.status(500).json({
        success: false,
        message: "Selected provider package is not available",
      });
    }

    // Split full name
    const nameParts = fullName.trim().split(/\s+/);

    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || null;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create User, SoleProvider and Subscription together
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          firstName,
          lastName,
          phone: phone?.trim() || null,
          role: "SOLE_PROVIDER",
          termsAcceptedAt: new Date(),
        },
      });

      const soleProvider = await tx.soleProvider.create({
        data: {
          userId: user.id,
          displayName: fullName.trim(),
          serviceName: serviceName.trim(),
          category: category?.trim() || null,
          experience: experience?.trim() || null,
          bio: bio?.trim() || null,
          city: city?.trim() || null,
        },
      });

      const billingStartDate = new Date();

      const nextBillingDate = new Date(billingStartDate);
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

      const subscription = await tx.providerSubscription.create({
        data: {
          soleProviderId: soleProvider.id,
          packageId: selectedPackage.id,
          status: "ACTIVE",
          dailyAppointmentLimit:
            selectedPackage.dailyAppointmentLimit,
          maxStaff: selectedPackage.maxStaff,
          billingStartDate,
          nextBillingDate,
          paymentStatus:
            packageTier === "BASIC" ? "PAID" : "PENDING",
        },
        include: {
          package: true,
        },
      });

      return {
        user,
        soleProvider,
        subscription,
      };
    });

    return res.status(201).json({
      success: true,
      message: "Provider account created successfully",
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        phone: result.user.phone,
        role: result.user.role,
        createdAt: result.user.createdAt,
      },
      provider: {
        id: result.soleProvider.id,
        displayName: result.soleProvider.displayName,
        serviceName: result.soleProvider.serviceName,
        category: result.soleProvider.category,
        experience: result.soleProvider.experience,
        bio: result.soleProvider.bio,
        city: result.soleProvider.city,
      },
      subscription: {
        id: result.subscription.id,
        status: result.subscription.status,
        paymentStatus: result.subscription.paymentStatus,
        dailyAppointmentLimit:
          result.subscription.dailyAppointmentLimit,
        package: {
          tier: result.subscription.package.tier,
          monthlyPrice: result.subscription.package.monthlyPrice,
        },
      },
    });
  } catch (error) {
    console.error("Provider registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the provider account",
    });
  }
};

export const registerBusiness = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      businessName,
      category,
      staffSize,
      contactName,
      email,
      phone,
      address,
      password,
      confirmPassword,
      packageTier,
      agree,
    } = req.body;

    // Required fields
    if (
      !businessName ||
      !category ||
      !staffSize ||
      !contactName ||
      !email ||
      !phone ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields",
      });
    }

    // Terms
    if (!agree) {
      return res.status(400).json({
        success: false,
        message: "You must accept the terms and privacy policy",
      });
    }

    // Password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Package validation
    if (packageTier !== "BASIC" && packageTier !== "GROWTH") {
      return res.status(400).json({
        success: false,
        message: "Invalid package selected",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check whether email is already registered
    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Find the selected business package
    const selectedPackage = await prisma.package.findUnique({
      where: {
        providerType_tier: {
          providerType: "BUSINESS",
          tier: packageTier,
        },
      },
    });

    if (!selectedPackage) {
      return res.status(400).json({
        success: false,
        message: "Selected package is not available",
      });
    }

    // Split contact name into first and last name
    const nameParts = contactName.trim().split(/\s+/);

    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || null;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Basic is free, so it is immediately paid.
    // Growth requires a subscription payment.
    const paymentStatus =
      packageTier === "BASIC" ? "PAID" : "PENDING";

    const now = new Date();

    // Calculate next monthly billing date
    const nextBillingDate = new Date(now);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    // Create user, business and subscription together
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          firstName,
          lastName,
          phone: phone.trim(),
          role: "BUSINESS_OWNER",
          termsAcceptedAt: now,
        },
      });

      const business = await tx.business.create({
        data: {
          ownerUserId: user.id,
          name: businessName.trim(),
          category: category.trim(),
          staffSize: staffSize.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          address: address.trim(),
        },
      });

      const subscription = await tx.providerSubscription.create({
        data: {
          businessId: business.id,
          packageId: selectedPackage.id,
          status: "ACTIVE",

          // Snapshot package limits at the time of subscription
          dailyAppointmentLimit:
            selectedPackage.dailyAppointmentLimit,
          maxStaff: selectedPackage.maxStaff,

          billingStartDate: now,
          nextBillingDate,
          paymentStatus,
        },
      });

      return {
        user,
        business,
        subscription,
      };
    });

    return res.status(201).json({
      success: true,
      message: "Business account created successfully",
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        phone: result.user.phone,
        role: result.user.role,
        createdAt: result.user.createdAt,
      },
      business: {
        id: result.business.id,
        name: result.business.name,
        category: result.business.category,
        staffSize: result.business.staffSize,
        email: result.business.email,
        phone: result.business.phone,
        address: result.business.address,
        createdAt: result.business.createdAt,
      },
      subscription: {
        id: result.subscription.id,
        packageId: result.subscription.packageId,
        status: result.subscription.status,
        dailyAppointmentLimit:
          result.subscription.dailyAppointmentLimit,
        maxStaff: result.subscription.maxStaff,
        billingStartDate: result.subscription.billingStartDate,
        nextBillingDate: result.subscription.nextBillingDate,
        paymentStatus: result.subscription.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Business registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the business account",
    });
  }
};
