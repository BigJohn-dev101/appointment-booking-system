import prisma from "./lib/prisma.js";

const packages = [
  {
    providerType: "SOLE_PROVIDER" as const,
    tier: "BASIC" as const,
    monthlyPrice: 0,
    dailyAppointmentLimit: 6,
    maxStaff: null,
    featureFlags: {
      standardPlacement: true,
      featuredPlacement: false,
      repeatCustomerAnalytics: false,
      customBranding: false,
    },
  },
  {
    providerType: "SOLE_PROVIDER" as const,
    tier: "GROWTH" as const,
    monthlyPrice: 99,
    dailyAppointmentLimit: 20,
    maxStaff: null,
    featureFlags: {
      standardPlacement: true,
      featuredPlacement: true,
      repeatCustomerAnalytics: true,
      customBranding: true,
    },
  },
  {
    providerType: "BUSINESS" as const,
    tier: "BASIC" as const,
    monthlyPrice: 0,
    dailyAppointmentLimit: 6,
    maxStaff: 3,
    featureFlags: {
      standardPlacement: true,
      featuredPlacement: false,
      advancedAnalytics: false,
      reEngagement: false,
    },
  },
  {
    providerType: "BUSINESS" as const,
    tier: "GROWTH" as const,
    monthlyPrice: 149,
    dailyAppointmentLimit: 20,
    maxStaff: 15,
    featureFlags: {
      standardPlacement: true,
      featuredPlacement: true,
      advancedAnalytics: true,
      reEngagement: true,
    },
  },
];

async function main() {
  console.log("Seeding packages...");

  for (const pkg of packages) {
    const result = await prisma.package.upsert({
      where: {
        providerType_tier: {
          providerType: pkg.providerType,
          tier: pkg.tier,
        },
      },
      update: {
        monthlyPrice: pkg.monthlyPrice,
        dailyAppointmentLimit: pkg.dailyAppointmentLimit,
        maxStaff: pkg.maxStaff,
        featureFlags: pkg.featureFlags,
      },
      create: pkg,
    });

    console.log(
      `✓ ${result.providerType} ${result.tier} - R${result.monthlyPrice}/month`,
    );
  }

  console.log("Package seeding completed.");
}

main()
  .catch((error) => {
    console.error("Package seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });