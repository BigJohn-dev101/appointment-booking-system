import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navigation = [
  { label: "Home", to: "/" },
  { label: "Providers", to: "/providers" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0F172A]">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0EA5E9] font-bold text-white">
            A
          </div>

          <span className="text-lg font-semibold text-white">
            Appointment
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-[#0EA5E9]"
                    : "text-slate-300 hover:text-[#0EA5E9]",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-white transition hover:text-[#0EA5E9]"
          >
            Sign in
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-[#0EA5E9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 lg:hidden"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 bg-white transition ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />

            <span
              className={`block h-0.5 w-5 bg-white transition ${
                menuOpen ? "opacity-0" : ""
              }`}
            />

            <span
              className={`block h-0.5 w-5 bg-white transition ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#0F172A] px-6 py-5 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  [
                    "rounded-lg px-3 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-white/5 text-[#0EA5E9]"
                      : "text-slate-300 hover:bg-white/5 hover:text-[#0EA5E9]",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg border border-white/20 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg bg-[#0EA5E9] px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}