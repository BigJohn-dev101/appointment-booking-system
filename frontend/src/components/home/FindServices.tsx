import { Link } from "react-router-dom";

type Provider = {
  id: number;
  name: string;
  category: string;
  description: string;
  hours: string;
  initials: string;
};

const providers: Provider[] = [
  {
    id: 1,
    name: "Precision Barbers",
    category: "Barber & Grooming",
    description: "Professional barbering and grooming appointments.",
    hours: "09:00–17:00",
    initials: "PB",
  },
  {
    id: 2,
    name: "Greenview Medical Practice",
    category: "General Practice",
    description:
      "General practice consultations and follow-ups. Scheduling only — no medical records.",
    hours: "08:00–16:00",
    initials: "GM",
  },
  {
    id: 3,
    name: "Nova Beauty Studio",
    category: "Beauty & Styling",
    description: "Beauty treatments and styling.",
    hours: "09:00–18:00",
    initials: "NB",
  },
  {
    id: 4,
    name: "Thabo Mobile Massage",
    category: "Massage Therapy",
    description: "Independent massage therapy practitioner.",
    hours: "08:00–17:00",
    initials: "TM",
  },
];

export default function FindServices() {
  return (
    <section
      id="services"
      className="border-t border-slate-200 bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#0EA5E9]">
            Find services
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
            Choose a provider
          </h2>

          <p className="mt-4 text-lg leading-8 text-[#334155]">
            Choose a business or independent provider to view their services
            and book an appointment.
          </p>
        </div>

        {/* Search */}
        <div className="mt-10">
          <div className="relative max-w-xl">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              type="search"
              placeholder="Search services or providers..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-sm text-[#334155] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:ring-4 focus:ring-sky-100"
            />
          </div>
        </div>

        {/* Provider cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {providers.map((provider) => (
            <article
              key={provider.id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div className="flex items-start gap-4">
                {/* Provider icon */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#0F172A] text-sm font-bold text-white">
                  {provider.initials}
                </div>

                <div className="min-w-0 flex-1">
                  {/* Status */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-[#0F172A]">
                        {provider.name}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-[#0EA5E9]">
                        {provider.category}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-[#22C55E]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                      Open
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-sm leading-6 text-[#334155]">
                    {provider.description}
                  </p>

                  {/* Hours */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Hours
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#334155]">
                        {provider.hours}
                      </p>
                    </div>

                    <Link
                      to={`/providers/${provider.id}`}
                      className="text-sm font-semibold text-[#0EA5E9] transition group-hover:text-sky-600"
                    >
                      View services →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View all */}
        <div className="mt-10 text-center">
          <Link
            to="/providers"
            className="inline-flex rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] transition hover:border-[#0EA5E9] hover:text-[#0EA5E9]"
          >
            View all providers
          </Link>
        </div>
      </div>
    </section>
  );
}