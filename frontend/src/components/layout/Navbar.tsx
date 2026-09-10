import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const navigation = [
  { label: "Home", to: "/" },
  { label: "Providers", to: "/providers" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navRefs = useRef<Record<string, HTMLElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  useEffect(() => {
    const activeItem = navigation.find((item) => item.to === location.pathname);
    const node = activeItem ? navRefs.current[activeItem.to] : null;

    if (node) {
      setIndicator({ left: node.offsetLeft, width: node.offsetWidth, ready: true });
    } else {
      setIndicator((current) => ({ ...current, ready: false }));
    }
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] font-[Clash_Display] text-base font-bold text-[#0F172A] shadow-[0_0_20px_-4px_rgba(14,165,233,0.6)]">
            IT
          </div>

          <span className="font-[Clash_Display] text-xl font-extrabold tracking-tight">
            <span className="text-white">ITThynk</span>
            <span className="text-[#38BDF8]">Appoint</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="relative hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              ref={(el) => {
                navRefs.current[item.to] = el as HTMLElement | null;
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                setIndicator({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
              }}
              onMouseLeave={() => {
                const activeItem = navigation.find((i) => i.to === location.pathname);
                const node = activeItem ? navRefs.current[activeItem.to] : null;
                if (node) {
                  setIndicator({ left: node.offsetLeft, width: node.offsetWidth, ready: true });
                } else {
                  setIndicator((c) => ({ ...c, ready: false }));
                }
              }}
              className={({ isActive }) =>
                [
                  "font-[Inter] text-sm font-medium transition-colors duration-200",
                  isActive ? "text-white" : "text-slate-400 hover:text-white",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}

          <span
            className="pointer-events-none absolute bottom-[-14px] h-[2px] rounded-full bg-[#0EA5E9] transition-all duration-300 ease-out"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.ready ? 1 : 0,
            }}
          />
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Sign in
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-[#0EA5E9] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_0_0_rgba(14,165,233,0)] transition-all duration-200 hover:bg-[#38BDF8] hover:shadow-[0_0_24px_-2px_rgba(14,165,233,0.55)]"
          >
            Get started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 transition-colors hover:border-[#0EA5E9]/50 lg:hidden"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 rounded-full bg-white transition-transform duration-200 ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-white transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-white transition-transform duration-200 ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0EA5E9]/40 to-transparent" />

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/5 bg-[#0F172A] px-6 py-5 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  [
                    "rounded-lg px-3 py-3 font-[Inter] text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#0EA5E9]/10 text-[#38BDF8]"
                      : "text-slate-400 hover:bg-white/5 hover:text-white",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/5 pt-5">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg border border-white/15 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:border-[#0EA5E9]/50"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg bg-[#0EA5E9] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#38BDF8]"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}