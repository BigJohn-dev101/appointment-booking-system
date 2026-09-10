import { Link } from "react-router-dom";

const icons = {
  layout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  ),
  trendingUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M17 7h4v4" />
    </svg>
  ),
  calendarClock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M12 14v3l2 1.2" />
    </svg>
  ),
  shieldCheck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4 6v6c0 4.5 3 7.5 8 9 5-1.5 8-4.5 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 8.6c0-3.2-2.4-5.1-5-5.1-1.7 0-3.3.9-4.3 2.4C10.5 4.4 8.9 3.5 7.2 3.5c-2.6 0-5 1.9-5 5.1 0 5.4 6.5 9.4 9.8 11.6 3.3-2.2 9.8-6.2 9.8-11.6Z" />
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4 6v6c0 4.5 3 7.5 8 9 5-1.5 8-4.5 8-9V6l-8-3Z" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c.7-3.2 3-5 5.5-5s4.8 1.8 5.5 5" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15.5 12.3c2 .3 3.6 1.9 4 4.7" />
    </svg>
  ),
  handshake: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m11 13-2.5 2.5a1.6 1.6 0 0 1-2.3-2.3L11 8.5l2 2 3-3 4 4-3.5 3.5a2.5 2.5 0 0 1-3.5 0" />
      <path d="M3 11v6M21 11v6" />
    </svg>
  ),
  flag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3v18" />
      <path d="M5 4h11l-2 4 2 4H5" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 11a8 8 0 0 0-14.6-4.6M4 5v4h4" />
      <path d="M4 13a8 8 0 0 0 14.6 4.6M20 19v-4h-4" />
    </svg>
  ),
};

const reasons = [
  {
    icon: icons.layout,
    title: "Intuitive by design",
    description:
      "Clear tools that help providers and customers manage appointments with confidence.",
  },
  {
    icon: icons.trendingUp,
    title: "Built to scale",
    description:
      "Designed to support independent providers as well as growing service businesses.",
  },
  {
    icon: icons.calendarClock,
    title: "Smarter scheduling",
    description:
      "Availability and organized calendars help providers manage appointments efficiently.",
  },
  {
    icon: icons.shieldCheck,
    title: "Reliable workflows",
    description:
      "Consistent booking, cancellation, and rescheduling workflows keep appointments organized.",
  },
];

const values = [
  {
    icon: icons.heart,
    title: "Customer first",
    description:
      "We focus on creating useful experiences for both customers and service providers.",
  },
  {
    icon: icons.sparkles,
    title: "Useful innovation",
    description:
      "We use technology to make appointment scheduling simpler and more efficient.",
  },
  {
    icon: icons.layers,
    title: "Simplicity at scale",
    description:
      "We aim to solve scheduling problems with clear and accessible tools.",
  },
  {
    icon: icons.shield,
    title: "Built for trust",
    description:
      "Security, privacy, and responsible handling of information guide the platform.",
  },
  {
    icon: icons.users,
    title: "Inclusive by design",
    description:
      "The platform is designed to support different types and sizes of service providers.",
  },
  {
    icon: icons.handshake,
    title: "Stay human",
    description:
      "Technology should improve how businesses and customers interact, not complicate it.",
  },
  {
    icon: icons.flag,
    title: "Own the outcome",
    description:
      "We take responsibility for building dependable and useful platform features.",
  },
  {
    icon: icons.refresh,
    title: "Continuous improvement",
    description:
      "We learn from testing and feedback to improve the booking experience.",
  },
];

const teamMembers = [
  {
    name: "Craig Magagula",
    role: "Frontend Developer",
    description:
      "Contributes to the design and implementation of the platform's frontend experience and reusable user interface components.",
    initials: "CM",
  },
  {
    name: "Mohau Manamela",
    role: "Data Analyst",
    description:
      "Contributes to data-related planning, system analysis, reporting, and the development of the appointment platform.",
    initials: "MM",
  },
  {
    name: "John Kutama",
    role: "Full Stack Developer",
    description:
      "Contributes to frontend and backend development, helping connect application interfaces with platform services and data.",
    initials: "JK",
  },
];

export default function About() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-14 text-center">
          <h1 className="font-[Clash_Display] text-4xl font-bold tracking-tight text-[#0F172A] md:text-5xl">
            About ITThynkAppoint
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl text-[#334155]">
            Making appointment scheduling simpler for customers and service
            providers.
          </p>
        </div>

        {/* About content */}
        <div className="mx-auto max-w-3xl text-[#334155]">
          <h2 className="mb-4 text-2xl font-bold text-[#0F172A]">
            Our mission
          </h2>

          <p className="mb-8 leading-8">
            At ITThynkAppoint, we believe that managing appointments should be
            straightforward. Our goal is to provide service providers and
            their customers with a reliable platform for discovering
            services, managing availability, and booking appointments.
          </p>

          <h2 className="mb-4 text-2xl font-bold text-[#0F172A]">
            What we do
          </h2>

          <p className="mb-6 leading-8">
            ITThynkAppoint is an appointment booking platform designed to
            connect customers with independent providers and service
            businesses. The platform is being developed to support:
          </p>

          <ul className="mb-8 space-y-3">
            {[
              "Provider and service discovery",
              "Appointment booking and management",
              "Provider and staff availability",
              "Service and staff management",
              "Booking cancellation and rescheduling",
              "Subscription packages for service providers",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0EA5E9]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h2 className="mb-4 text-2xl font-bold text-[#0F172A]">
            Who ITThynkAppoint is for
          </h2>

          <p className="leading-8">
            The platform is designed for customers, independent service
            providers, and businesses with multiple staff members. This
            allows one application to support different appointment-based
            industries while maintaining a consistent booking experience.
          </p>
        </div>

        {/* Why choose */}
        <section className="mt-24" aria-labelledby="why-choose-heading">
          <div className="mb-10 text-center">
            <h2
              id="why-choose-heading"
              className="font-[Clash_Display] text-3xl font-bold text-[#0F172A] md:text-4xl"
            >
              Why choose ITThynkAppoint?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#334155]">
              A platform designed to make appointment management clear,
              organized, and accessible.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason) => (
              <article
                key={reason.title}
                className="min-h-56 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#0EA5E9]/40 hover:shadow-xl hover:shadow-slate-200/60"
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] text-white shadow-[0_8px_20px_-6px_rgba(14,165,233,0.5)]">
                  <div className="h-5 w-5">{reason.icon}</div>
                </div>

                <h3 className="text-lg font-semibold text-[#0F172A]">
                  {reason.title}
                </h3>

                <p className="mt-3 text-base leading-7 text-[#334155]">
                  {reason.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mt-24" aria-labelledby="values-heading">
          <div className="mb-10 text-center">
            <h2
              id="values-heading"
              className="font-[Clash_Display] text-3xl font-bold text-[#0F172A] md:text-4xl"
            >
              Our values
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#334155]">
              Principles that guide how the platform is designed and
              developed.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article
                key={value.title}
                className="min-h-56 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#0EA5E9]/40 hover:shadow-xl hover:shadow-slate-200/60"
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0EA5E9] shadow-sm ring-1 ring-slate-200">
                  <div className="h-5 w-5">{value.icon}</div>
                </div>

                <h3 className="text-lg font-semibold text-[#0F172A]">
                  {value.title}
                </h3>

                <p className="mt-3 text-base leading-7 text-[#334155]">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mt-24" aria-labelledby="team-heading">
          <div className="mb-10 text-center">
            <h2
              id="team-heading"
              className="font-[Clash_Display] text-3xl font-bold text-[#0F172A] md:text-4xl"
            >
              Meet the ITThynkAppoint team
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#334155]">
              The team contributing to the design and development of the
              appointment booking platform.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 text-center transition duration-200 hover:-translate-y-1 hover:border-[#0EA5E9]/40 hover:shadow-xl hover:shadow-slate-200/60"
              >
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#1E293B] to-[#0F172A] font-[Clash_Display] text-xl font-bold text-[#38BDF8] ring-8 ring-white">
                  {member.initials}
                </div>

                <h3 className="text-xl font-semibold text-[#0F172A]">
                  {member.name}
                </h3>

                <p className="mt-1 text-sm font-semibold text-[#0EA5E9]">
                  {member.role}
                </p>

                <p className="mt-4 text-base leading-7 text-[#334155]">
                  {member.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <Link
            to="/register"
            className="rounded-xl bg-[#0EA5E9] px-8 py-3.5 font-semibold text-white shadow-[0_0_0_0_rgba(14,165,233,0)] transition-all duration-200 hover:bg-[#38BDF8] hover:shadow-[0_0_28px_-4px_rgba(14,165,233,0.55)]"
          >
            Get started today
          </Link>
        </div>
      </div>
    </section>
  );
}