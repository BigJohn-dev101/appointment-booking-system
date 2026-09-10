import { Link } from "react-router-dom";

type AccountType = {
  initial: string;
  title: string;
  description: string;
  features: string[];
  to: string;
  accent: string;
  accentSoft: string;
  recommended?: boolean;
};

const accountTypes: AccountType[] = [
  {
    initial: "C",
    title: "Customer",
    description:
      "Find providers, book services, and manage your appointments.",
    to: "/register/customer",
    accent: "#475569",
    accentSoft: "#E2E8F0",
    features: [
      "Book appointments for free",
      "Manage upcoming bookings",
      "Cancel or reschedule appointments",
    ],
  },
  {
    initial: "P",
    title: "Independent Provider",
    description:
      "List your services and let customers book appointments with you.",
    to: "/register/provider",
    accent: "#0F766E",
    accentSoft: "#CCFBF1",
    recommended: true,
    features: [
      "Create your provider profile",
      "Manage services and availability",
      "Track customer appointments",
    ],
  },
  {
    initial: "B",
    title: "Business",
    description:
      "Manage services, staff schedules, and customer bookings in one place.",
    to: "/register/business",
    accent: "#B45309",
    accentSoft: "#FEF3C7",
    features: [
      "Manage multiple staff members",
      "Assign services to staff",
      "Control calendars and bookings",
    ],
  },
];

export default function Register() {
  return (
    <section
      className="min-h-screen"
      style={{ backgroundColor: "#F6F5F1", fontFamily: "'Inter', sans-serif" }}
    >
      <div className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
        {/* Heading */}
        <div className="rounded-3xl bg-[#0F172A] p-7 text-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.8)] sm:p-8">
          <div className="flex items-baseline justify-between border-b border-white/10 pb-6">
            <span
              className="text-sm text-slate-400"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              New sign-up · today
            </span>
            <span className="text-sm font-medium text-white">
              ITThynkAppoint
            </span>
          </div>

          <h1
            className="mt-8 text-4xl leading-tight tracking-tight text-white sm:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
          >
            Choose how you'll show up on ITThynkAppoint
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
            Every account starts the same way a booking does: pick a slot. Find
            the row that matches how you plan to use the platform, and
            continue from there.
          </p>
        </div>

        {/* Schedule */}
        <div className="mt-14 border-t border-[#DCD9CE]">
          {accountTypes.map((account) => (
            <article
              key={account.title}
              className="group grid grid-cols-[64px_4px_1fr] gap-x-5 border-b border-[#DCD9CE] py-7 sm:grid-cols-[80px_4px_1fr_auto] sm:items-center sm:gap-x-7"
            >
              {/* Initial */}
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold sm:h-10 sm:w-10"
                style={{ backgroundColor: account.accentSoft, color: account.accent }}
              >
                {account.initial}
              </div>

              {/* Accent bar */}
              <div
                className="h-full w-1 self-stretch rounded-full"
                style={{ backgroundColor: account.accent }}
              />

              {/* Content */}
              <div className="col-span-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold text-[#14171F]">
                    {account.title}
                  </h2>
                  {account.recommended && (
                    <span
                      className="rounded px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: account.accentSoft,
                        color: account.accent,
                      }}
                    >
                      Most popular
                    </span>
                  )}
                </div>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#4B5058]">
                  {account.description}
                </p>
                <ul className="mt-4 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-1.5">
                  {account.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-[#4B5058]"
                    >
                      <span
                        className="h-1 w-1 rounded-full"
                        style={{ backgroundColor: account.accent }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="col-span-3 mt-6 sm:col-span-1 sm:mt-0">
                <Link
                  to={account.to}
                  className="inline-flex items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors"
                  style={{
                    borderColor: account.accent,
                    color: account.accent,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = account.accent;
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = account.accent;
                  }}
                >
                  Continue as {account.title}
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Existing user */}
        <div className="mt-10 flex items-center justify-center gap-3 text-sm text-[#6B7280]">
          Already have an account?
          <Link
            to="/login"
            className="inline-flex items-center rounded-full border border-[#DCD9CE] bg-white px-4 py-2 text-sm font-medium text-[#14171F] shadow-sm transition-colors hover:border-[#0F766E] hover:bg-[#F0FDFA] hover:text-[#0F766E]"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}