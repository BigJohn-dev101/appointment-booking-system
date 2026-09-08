import { Link } from "react-router-dom";

export default function About() {
  const reasons = [
    {
      icon: "◎",
      title: "Intuitive by design",
      description:
        "Clear tools that help providers and customers manage appointments with confidence.",
    },
    {
      icon: "✦",
      title: "Built to scale",
      description:
        "Designed to support independent providers as well as growing service businesses.",
    },
    {
      icon: "↗",
      title: "Smarter scheduling",
      description:
        "Availability and organized calendars help providers manage appointments efficiently.",
    },
    {
      icon: "✓",
      title: "Reliable workflows",
      description:
        "Consistent booking, cancellation, and rescheduling workflows keep appointments organized.",
    },
  ];

  const values = [
    {
      icon: "♡",
      title: "Customer first",
      description:
        "We focus on creating useful experiences for both customers and service providers.",
    },
    {
      icon: "✧",
      title: "Useful innovation",
      description:
        "We use technology to make appointment scheduling simpler and more efficient.",
    },
    {
      icon: "◇",
      title: "Simplicity at scale",
      description:
        "We aim to solve scheduling problems with clear and accessible tools.",
    },
    {
      icon: "⌁",
      title: "Built for trust",
      description:
        "Security, privacy, and responsible handling of information guide the platform.",
    },
    {
      icon: "◌",
      title: "Inclusive by design",
      description:
        "The platform is designed to support different types and sizes of service providers.",
    },
    {
      icon: "⌁",
      title: "Stay human",
      description:
        "Technology should improve how businesses and customers interact, not complicate it.",
    },
    {
      icon: "⚑",
      title: "Own the outcome",
      description:
        "We take responsibility for building dependable and useful platform features.",
    },
    {
      icon: "↻",
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

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
            About AppointHub
          </h1>

          <p className="mt-6 text-xl text-slate-600">
            Making appointment scheduling simpler for customers and service
            providers.
          </p>
        </div>

        {/* About content */}
        <div className="max-w-none text-slate-700">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Our Mission
          </h2>

          <p className="mb-8 leading-8">
            At AppointHub, we believe that managing appointments should be
            straightforward. Our goal is to provide service providers and their
            customers with a reliable platform for discovering services,
            managing availability, and booking appointments.
          </p>

          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            What We Do
          </h2>

          <p className="mb-6 leading-8">
            AppointHub is an appointment booking platform designed to connect
            customers with independent providers and service businesses. The
            platform is being developed to support:
          </p>

          <ul className="mb-8 list-inside list-disc space-y-3">
            <li>Provider and service discovery</li>
            <li>Appointment booking and management</li>
            <li>Provider and staff availability</li>
            <li>Service and staff management</li>
            <li>Booking cancellation and rescheduling</li>
            <li>Subscription packages for service providers</li>
          </ul>

          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Who AppointHub Is For
          </h2>

          <p className="leading-8">
            The platform is designed for customers, independent service
            providers, and businesses with multiple staff members. This allows
            one application to support different appointment-based industries
            while maintaining a consistent booking experience.
          </p>
        </div>

        {/* Why choose */}
        <section
          className="mt-20"
          aria-labelledby="why-choose-heading"
        >
          <div className="mb-8 text-center">
            <h2
              id="why-choose-heading"
              className="text-3xl font-bold text-slate-900 md:text-4xl"
            >
              Why choose AppointHub?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              A platform designed to make appointment management clear,
              organized, and accessible.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason) => (
              <article
                key={reason.title}
                className="min-h-56 rounded-2xl bg-slate-50 p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-xl font-semibold text-sky-700 shadow-sm ring-1 ring-slate-100"
                  aria-hidden="true"
                >
                  {reason.icon}
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  {reason.title}
                </h3>

                <p className="mt-3 text-base leading-7 text-slate-600">
                  {reason.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mt-24" aria-labelledby="values-heading">
          <div className="mb-8 text-center">
            <h2
              id="values-heading"
              className="text-3xl font-bold text-slate-900 md:text-4xl"
            >
              Our values
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Principles that guide how the platform is designed and developed.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article
                key={value.title}
                className="min-h-56 rounded-2xl bg-slate-50 p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-xl font-semibold text-sky-700 shadow-sm ring-1 ring-slate-100"
                  aria-hidden="true"
                >
                  {value.icon}
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  {value.title}
                </h3>

                <p className="mt-3 text-base leading-7 text-slate-600">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mt-24" aria-labelledby="team-heading">
          <div className="mb-8 text-center">
            <h2
              id="team-heading"
              className="text-3xl font-bold text-slate-900 md:text-4xl"
            >
              Meet the AppointHub team
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              The team contributing to the design and development of the
              appointment booking platform.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="rounded-2xl bg-slate-50 p-6 text-center shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 text-xl font-bold text-sky-700 ring-8 ring-white"
                  aria-hidden="true"
                >
                  {member.initials}
                </div>

                <h3 className="text-xl font-semibold text-slate-900">
                  {member.name}
                </h3>

                <p className="mt-1 text-sm font-semibold text-sky-700">
                  {member.role}
                </p>

                <p className="mt-4 text-base leading-7 text-slate-600">
                  {member.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-14 flex justify-center">
          <Link
            to="/register"
            className="rounded-lg bg-sky-500 px-8 py-3 font-semibold text-white transition hover:bg-sky-600"
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </section>
  );
}