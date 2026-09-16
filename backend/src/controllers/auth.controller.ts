import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RULES: { label: string; test: RegExp }[] = [
  { label: "at least 8 characters", test: /.{8,}/ },
  { label: "one uppercase letter", test: /[A-Z]/ },
  { label: "one lowercase letter", test: /[a-z]/ },
  { label: "one number", test: /\d/ },
  { label: "one special character", test: /[^A-Za-z0-9]/ },
];

function getPasswordComplexityError(password: unknown): string | null {
  if (typeof password !== "string") {
    return "Password is required";
  }

  const failed = PASSWORD_RULES.filter((rule) => !rule.test.test(password));

  if (failed.length === 0) {
    return null;
  }

  return `Password must contain ${failed.map((rule) => rule.label).join(", ")}`;
}

async function isPhoneTaken(phone: string): Promise<boolean> {
  const [existingUserPhone, existingBusinessPhone] = await Promise.all([
    prisma.user.findFirst({ where: { phone } }),
    prisma.business.findFirst({ where: { phone } }),
  ]);

  return Boolean(existingUserPhone || existingBusinessPhone);
}

function normalizePhone(rawPhone: string): string | null {
  // Strip everything except digits and a leading +
  const trimmed = rawPhone.trim();
  const digitsAndPlus = trimmed.replace(/(?!^\+)[^\d]/g, "");

  let normalized: string;

  if (digitsAndPlus.startsWith("+27")) {
    normalized = digitsAndPlus;
  } else if (digitsAndPlus.startsWith("0")) {
    normalized = `+27${digitsAndPlus.slice(1)}`;
  } else if (digitsAndPlus.startsWith("27")) {
    normalized = `+${digitsAndPlus}`;
  } else {
    return null;
  }

  // A valid SA number is +27 followed by exactly 9 digits
  const isValid = /^\+27\d{9}$/.test(normalized);

  return isValid ? normalized : null;
}


const USER_ROLE_INCLUDE = {
  soleProvider: true,
  business: true,
  businessStaff: {
    include: {
      business: true,
    },
  },
} as const;

type UserWithRoleData = Awaited<
  ReturnType<
    typeof prisma.user.findUnique<{
      where: { id: string };
      include: typeof USER_ROLE_INCLUDE;
    }>
  >
>;


function serializeUser(user: NonNullable<UserWithRoleData>) {
  const { passwordHash: _passwordHash, ...safeUser } = user;

  return {
    ...safeUser,
    soleProvider: user.role === "SOLE_PROVIDER" ? user.soleProvider : null,
    business: user.role === "BUSINESS_OWNER" ? user.business : null,
    businessStaff:
      user.role === "BUSINESS_STAFF" ? user.businessStaff : null,
  };
}

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

    if (!EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
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

    // Check password complexity
    const passwordError = getPasswordComplexityError(password);

    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError,
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

    const normalizedUserPhone = phone?.trim() ? normalizePhone(phone) : null;

    if (phone?.trim() && !normalizedUserPhone) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    if (normalizedUserPhone && (await isPhoneTaken(normalizedUserPhone))) {
      return res.status(409).json({
        success: false,
        message: "This phone number is already in use",
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
        phone: normalizedUserPhone,
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
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "An account with this email or phone number already exists",
      });
    }

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

    if (!EMAIL_REGEX.test(String(email).trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Find user, including whichever role-specific relation applies
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
      include: USER_ROLE_INCLUDE,
    });

    // Don't reveal whether the email exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Wrong login credentials",
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
        message: "Wrong login credentials",
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

    res.cookie("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging in",
    });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("session", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
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
      include: USER_ROLE_INCLUDE,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: serializeUser(user),
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

    if (!EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
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

    // Check password complexity
    const passwordError = getPasswordComplexityError(password);

    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError,
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

        const normalizedUserPhone = phone?.trim() ? normalizePhone(phone) : null;

    if (phone?.trim() && !normalizedUserPhone) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    if (normalizedUserPhone && (await isPhoneTaken(normalizedUserPhone))) {
      return res.status(409).json({
        success: false,
        message: "This phone number is already in use",
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
          phone: normalizedUserPhone,
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
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "An account with this email or phone number already exists",
      });
    }

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

    if (!EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
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

    // Check password complexity
    const passwordError = getPasswordComplexityError(password);

    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError,
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

        const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    if (await isPhoneTaken(normalizedPhone)) {
      return res.status(409).json({
        success: false,
        message: "This phone number is already in use",
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
          phone: normalizedPhone,
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
          phone: normalizedPhone,
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
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "An account with this email or phone number already exists",
      });
    }

    console.error("Business registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the business account",
    });
  }
};