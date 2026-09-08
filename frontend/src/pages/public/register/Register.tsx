import { Link } from "react-router-dom";

type AccountType = {
  title: string;
  description: string;
  features: string[];
  to: string;
  initials: string;
  recommended?: boolean;
};

const accountTypes: AccountType[] = [
  {
    title: "Customer",
    description:
      "Find providers, book services, and manage your appointments.",
    initials: "C",
    to: "/register/customer",
    features: [
      "Book appointments for free",
      "Manage upcoming bookings",
      "Cancel or reschedule appointments",
    ],
  },
  {
    title: "Independent Provider",
    description:
      "List your services and allow customers to book appointments with you.",
    initials: "P",
    to: "/register/provider",
    recommended: true,
    features: [
      "Create your provider profile",
      "Manage services and availability",
      "Track customer appointments",
    ],
  },
  {
    title: "Business",
    description:
      "Manage services, staff schedules, and customer bookings in one place.",
    initials: "B",
    to: "/register/business",
    features: [
      "Manage multiple staff members",
      "Assign services to staff",
      "Control calendars and bookings",
    ],
  },
];

export default function Register() {
  return (
    <section className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-[#0EA5E9]">
            Get started
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#0F172A] sm:text-5xl">
            Choose how you'll use AppointHub
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#334155]">
            Select the account type that best matches how you plan to use the
            appointment platform.
          </p>
        </div>

        {/* Account choices */}
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-3">
          {accountTypes.map((account) => (
            <article
              key={account.title}
              className={`relative flex flex-col rounded-3xl bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl ${
                account.recommended
                  ? "border-2 border-[#0EA5E9] shadow-lg shadow-sky-100"
                  : "border border-slate-200"
              }`}
            >
              {account.recommended && (
                <span className="absolute right-5 top-5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#0EA5E9]">
                  Popular
                </span>
              )}

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F172A] font-bold text-white">
                {account.initials}
              </div>

              <h2 className="mt-6 text-xl font-semibold text-[#0F172A]">
                {account.title}
              </h2>

              <p className="mt-3 min-h-[72px] text-sm leading-7 text-[#334155]">
                {account.description}
              </p>

              <ul className="mt-6 flex-1 space-y-4">
                {account.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-[#334155]"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-[#22C55E]">
                      ✓
                    </span>

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={account.to}
                className={`mt-8 flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold transition ${
                  account.recommended
                    ? "bg-[#0EA5E9] text-white hover:bg-sky-600"
                    : "border border-slate-300 bg-white text-[#0F172A] hover:border-[#0EA5E9] hover:text-[#0EA5E9]"
                }`}
              >
                Continue as {account.title}
              </Link>
            </article>
          ))}
        </div>

        {/* Existing user */}
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#0EA5E9] hover:text-sky-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}