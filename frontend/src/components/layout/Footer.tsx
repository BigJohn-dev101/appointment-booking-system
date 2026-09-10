import { Link } from "react-router-dom";

const productLinks = [
  { label: "Features", to: "/" },
  { label: "Pricing", to: "/pricing" },
  { label: "Integrations", to: "/" },
  { label: "Updates", to: "/" },
];

const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Support", to: "/" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/" },
  { label: "Terms of Service", to: "/" },
  { label: "Cookie Policy", to: "/" },
];

const socialLinks = [
  { label: "LinkedIn", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] font-[Clash_Display] text-base font-bold text-[#0F172A] shadow-[0_0_20px_-4px_rgba(14,165,233,0.6)]">
                IT
              </div>

              <h3 className="font-[Clash_Display] text-xl font-extrabold tracking-tight">
                <span className="text-white">ITThynk</span>
                <span className="text-[#38BDF8]">Appoint</span>
              </h3>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              Helping service businesses manage appointments, staff schedules,
              and customer bookings with confidence.
            </p>

            <div className="mt-6 flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-xs font-medium text-slate-400 transition-colors hover:border-[#0EA5E9]/50 hover:text-[#38BDF8]"
                >
                  {link.label.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white">Product</h4>

            <ul className="mt-5 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 transition-colors hover:text-[#38BDF8]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white">Company</h4>

            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 transition-colors hover:text-[#38BDF8]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white">Legal</h4>

            <ul className="mt-5 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 transition-colors hover:text-[#38BDF8]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Gradient hairline, matches navbar */}
        <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-[#0EA5E9]/40 to-transparent" />

        {/* Bottom */}
        <div className="flex flex-col gap-5 pt-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ITThynkAppoint. All rights reserved.</p>

          <div className="flex flex-wrap gap-5">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-[#38BDF8]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}