const steps = [
  {
    number: "01",
    title: "Find a service",
    description:
      "Browse businesses and independent providers offering the service you need.",
  },
  {
    number: "02",
    title: "Choose a time",
    description:
      "View available appointment times and select the slot that works for you.",
  },
  {
    number: "03",
    title: "Book your appointment",
    description:
      "Enter your details and confirm your appointment. Customer booking is free.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#F8FAFC] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#0EA5E9]">
            How it works
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
            Book in three simple steps
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[#334155]">
            Find the service you need, choose an available time and confirm
            your appointment.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-slate-200 bg-white p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sm font-bold text-[#0EA5E9]">
                {step.number}
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