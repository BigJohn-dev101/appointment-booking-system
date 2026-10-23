export function getDashboardPath(role: string): string | null {
  switch (role) {
    case "CUSTOMER":
      return "/dashboard/customer";
    case "SOLE_PROVIDER":
      return "/dashboard/provider";
    case "BUSINESS_OWNER":
      return "/dashboard/business";
    case "BUSINESS_STAFF":
      return "/dashboard/staff";
    case "ADMIN":
      return "/dashboard/admin";
    default:
      return null;
  }
}
