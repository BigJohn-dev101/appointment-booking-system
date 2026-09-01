import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Platform",
    links: [
      { label: "Providers", to: "/providers" },
      { label: "Pricing", to: "/pricing" },
      { label: "Get started", to: "/register" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help", to: "/help" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0EA5E9] font-bold text-white">
                A
              </div>

              <span className="text-lg font-semibold">
                Appointment
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Helping customers discover service providers and book
              appointments while giving providers a simpler way to manage
              services, schedules and availability.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white">
                {section.title}
              </h3>

              <div className="mt-5 flex flex-col gap-3">
                {section.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm text-slate-400 transition hover:text-[#0EA5E9]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Appointment Platform. All rights
            reserved.
          </p>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
            Platform operational
          </div>
        </div>
      </div>
    </footer>
  );
}