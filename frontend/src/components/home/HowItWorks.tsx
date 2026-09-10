const steps = [
  {
    number: "01",
    title: "Find a service",
    description:
      "Browse businesses and independent providers offering the service you need.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Choose a time",
    description:
      "View available appointment times and select the slot that works for you.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M3 10h18M8 3v4M16 3v4" />
        <path d="M12 14v3l2 1.2" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Book your appointment",
    description:
      "Enter your details and confirm your appointment. Customer booking is free.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12.5 11 15l4.5-5" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#F8FAFC] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[Clash_Display] text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
            Book in three simple steps
          </h2>

          <p className="mt-4 text-[#334155]">
            Find the service you need, choose an available time and confirm
            your appointment.
          </p>
        </div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3 md:gap-6">
          {/* Connector line, desktop only — sits behind the icon row */}
          <div
            aria-hidden="true"
            className="absolute left-[16.5%] right-[16.5%] top-6 hidden h-px bg-gradient-to-r from-[#0EA5E9]/0 via-[#0EA5E9]/30 to-[#0EA5E9]/0 md:block"
          />

          {steps.map((step) => (
            <div key={step.number} className="relative rounded-2xl border border-slate-200 bg-white p-7">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] text-white shadow-[0_8px_20px_-6px_rgba(14,165,233,0.5)]">
                  <div className="h-5 w-5">{step.icon}</div>
                </div>

                <span className="font-[Clash_Display] text-2xl font-bold text-slate-200">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-6 text-lg font-semibold text-[#0F172A]">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#334155]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}