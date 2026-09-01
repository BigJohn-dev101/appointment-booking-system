import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F8FAFC]">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="absolute right-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-[#0EA5E9]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute bottom-[-200px] left-[-150px] h-[450px] w-[450px] rounded-full bg-[#22C55E]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 text-center lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl">
          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />

            <span className="text-sm font-medium text-[#334155]">
              Simple appointment booking
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-bold tracking-tight text-[#0F172A] sm:text-6xl lg:text-7xl">
            Find the right service.
            <span className="block text-[#0EA5E9]">
              Book the right time.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#334155]">
            Discover service providers, explore their services and availability,
            and book an appointment in just a few steps.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#services"
              className="rounded-xl bg-[#0EA5E9] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
            >
              Find a service
            </a>

            <Link
              to="/register/provider"
              className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-[#0F172A] transition hover:border-[#0EA5E9] hover:text-[#0EA5E9]"
            >
              List your services
            </Link>
          </div>

          {/* Benefits */}
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Feature text="Free customer booking" />
            <Feature text="Live availability" />
            <Feature text="Simple scheduling" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#334155]">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-[#22C55E]">
        ✓
      </div>

      {text}
    </div>
  );
}