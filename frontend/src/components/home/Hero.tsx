import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0F172A]">
      {/* Background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1758691737568-a1572060ce5a?fm=jpg&q=80&w=2400&auto=format&fit=crop')",
        }}
      />

      {/* Overlay for legibility — darker at edges, clearer center-top */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/75 to-[#0F172A]"
      />

      {/* Soft sky glow, echoes the navbar accent */}
      <div
        aria-hidden="true"
        className="absolute right-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-[#0EA5E9]/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-28 text-center lg:px-8 lg:py-36">
        <div className="mx-auto max-w-4xl">
          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
            <span className="text-sm font-medium text-slate-200">
              Simple appointment booking
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-[Clash_Display] text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Find the right service.
            <span className="block text-[#38BDF8]">Book the right time.</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            Discover service providers, explore their services and availability,
            and book an appointment in just a few steps.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#services"
              className="rounded-xl bg-[#0EA5E9] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_0_0_rgba(14,165,233,0)] transition-all duration-200 hover:bg-[#38BDF8] hover:shadow-[0_0_28px_-2px_rgba(14,165,233,0.55)]"
            >
              Find a service
            </a>

            <Link
              to="/register/provider"
              className="rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-[#0EA5E9]/60 hover:text-[#38BDF8]"
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
    <div className="flex items-center gap-2 text-sm text-slate-300">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0EA5E9]/15 text-xs font-bold text-[#38BDF8]">
        ✓
      </div>
      {text}
    </div>
  );
}