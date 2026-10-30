import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProviders } from "../../services/providers";
import type { Provider } from "../../types/providers";

export default function FindServices() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void fetchProviders()
      .then((data) => { if (active) setProviders(data); })
      .catch((error: unknown) => {
        console.error("Home provider list fetch failed:", error);
        if (active) setLoadError(error instanceof Error ? error.message : "Unable to load providers.");
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const filteredProviders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return providers;
    return providers.filter((provider) => provider.name.toLowerCase().includes(query)
      || provider.category.toLowerCase().includes(query)
      || provider.description.toLowerCase().includes(query)
      || provider.services.some((service) => service.name.toLowerCase().includes(query)));
  }, [providers, searchQuery]);

  return (
    <section id="services" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-[Clash_Display] text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">Choose a provider</h2>
          <p className="mt-4 text-lg leading-8 text-[#334155]">Choose a business or independent provider to view their services and book an appointment.</p>
        </div>

        <div className="mt-10">
          <div className="relative max-w-xl">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search services or providers..." className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-sm text-[#334155] outline-none transition focus:border-[#0EA5E9] focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400" />
          </div>
        </div>

        {isLoading ? (
          <div className="mt-10 grid animate-pulse gap-6 md:grid-cols-2" role="status" aria-label="Loading providers">{[0, 1, 2, 3].map((item) => <div key={item} className="flex gap-4 rounded-2xl border border-slate-200 p-6"><div className="h-14 w-14 rounded-xl bg-slate-200" /><div className="flex-1 space-y-3"><div className="h-5 w-1/2 rounded bg-slate-200" /><div className="h-4 w-1/3 rounded bg-slate-100" /><div className="h-12 rounded bg-slate-100" /></div></div>)}</div>
        ) : loadError ? (
          <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800" role="alert">Providers could not be loaded: {loadError}</div>
        ) : filteredProviders.length === 0 ? (
          <p className="mt-10 text-sm text-slate-500">{searchQuery ? "No providers match your search." : "No providers are available yet."}</p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {filteredProviders.slice(0, 4).map((provider) => <article key={provider.id} className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#0EA5E9]/40 hover:shadow-xl hover:shadow-slate-200/60">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] font-[Clash_Display] text-sm font-bold text-[#38BDF8] ring-1 ring-white/10">{provider.initials}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-lg font-semibold text-[#0F172A]">{provider.name}</h3><p className="mt-1 text-sm font-medium text-[#0EA5E9]">{provider.category}</p></div><span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${provider.status === "Open" ? "bg-green-50 text-[#22C55E]" : "bg-slate-100 text-slate-500"}`}><span className={`h-1.5 w-1.5 rounded-full ${provider.status === "Open" ? "bg-[#22C55E]" : "bg-slate-400"}`} />{provider.status}</span></div>
                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#334155]">{provider.description || "Explore services from this provider."}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><div><p className="text-xs font-medium text-slate-400">Hours</p><p className="mt-1 text-sm font-semibold text-[#334155]">{provider.hours}</p></div><Link to={`/providers/${encodeURIComponent(provider.id)}`} className="flex items-center gap-1.5 text-sm font-semibold text-[#0EA5E9] transition-colors group-hover:text-sky-600">View services <span aria-hidden="true">›</span></Link></div>
                </div>
              </div>
            </article>)}
          </div>
        )}

        <div className="mt-10 text-center"><Link to="/providers" className="inline-flex rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] transition-colors hover:border-[#0EA5E9] hover:text-[#0EA5E9]">View all providers</Link></div>
      </div>
    </section>
  );
}
