import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProvider } from "../../../services/providers";
import type { Provider } from "../../../types/providers";

const SERVICES_PER_PAGE = 6;

export default function ProviderProfile() {
  const { id } = useParams();
  const [providerState, setProviderState] = useState<{ id: string; provider: Provider | null; error: string | null }>({ id: "", provider: null, error: null });
  const [servicePageState, setServicePageState] = useState({ id: "", page: 1 });
  const isLoading = Boolean(id) && providerState.id !== id;
  const provider = providerState.id === id ? providerState.provider : null;
  const loadError = providerState.id === id ? providerState.error : null;
  const servicePage = servicePageState.id === id ? servicePageState.page : 1;

  useEffect(() => {
    if (!id) return;
    let active = true;
    void fetchProvider(id)
      .then((data) => { if (active) setProviderState({ id, provider: data, error: null }); })
      .catch((error: unknown) => {
        console.error("Public provider detail fetch failed:", error);
        if (active) setProviderState({ id, provider: null, error: error instanceof Error ? error.message : "Unable to load provider." });
      });
    return () => { active = false; };
  }, [id]);

  if (isLoading) {
    return <section className="min-h-[60vh] bg-[#F8FAFC] py-14"><div className="mx-auto max-w-7xl animate-pulse px-6 lg:px-8" role="status" aria-label="Loading provider"><div className="h-5 w-32 rounded bg-slate-200" /><div className="mt-8 h-28 rounded-2xl bg-white" /><div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="h-64 rounded-2xl border border-slate-200 bg-white p-6"><div className="h-5 w-1/2 rounded bg-slate-200" /><div className="mt-5 h-12 rounded bg-slate-100" /></div>)}</div></div></section>;
  }

  if (!provider) {
    return (
      <section className="min-h-[60vh] bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <h1 className="font-[Clash_Display] text-3xl font-bold text-[#0F172A]">
              Provider not found
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              {loadError ? "Provider details could not be loaded. Please try again." : "The provider you are looking for does not exist or is no longer available."}
            </p>

            <Link
              to="/providers"
              className="mt-6 inline-flex rounded-xl bg-[#0EA5E9] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
            >
              Back to providers
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const isOpen = provider.status === "Open";
  const totalServicePages = Math.max(
    1,
    Math.ceil(provider.services.length / SERVICES_PER_PAGE)
  );
  const paginatedServices = provider.services.slice(
    (servicePage - 1) * SERVICES_PER_PAGE,
    servicePage * SERVICES_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Provider heading */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <Link
            to="/providers"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0EA5E9] transition-colors hover:text-sky-700"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to providers
          </Link>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] font-[Clash_Display] text-xl font-bold text-[#38BDF8] ring-1 ring-white/10">
                {provider.initials}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-semibold text-[#0EA5E9]">
                    {provider.category}
                  </p>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      isOpen
                        ? "bg-green-50 text-[#22C55E]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isOpen ? "bg-[#22C55E]" : "bg-slate-400"
                      }`}
                    />
                    {provider.status}
                  </span>
                </div>

                <h1 className="mt-2 font-[Clash_Display] text-4xl font-bold tracking-tight text-[#0F172A] sm:text-5xl">
                  {provider.name}
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-[#334155]">
                  {provider.description}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] px-5 py-4 md:min-w-52">
              <p className="text-xs font-medium text-slate-400">
                Business hours
              </p>

              <p className="mt-2 text-lg font-semibold text-[#0F172A]">
                {provider.hours}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0EA5E9]/25 to-transparent" />
      </section>

      {/* Services */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-[Clash_Display] text-3xl font-bold text-[#0F172A]">
                Choose a service
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#334155]">
                Select the service you want to book. You will choose an
                available appointment time in the next step.
              </p>
            </div>

            <p className="text-sm text-slate-500">
              {provider.services.length}{" "}
              {provider.services.length === 1 ? "service" : "services"} available
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {paginatedServices.map((service) => (
              <article
                key={service.id}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#0EA5E9]/40 hover:shadow-xl hover:shadow-slate-200/60"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#0F172A]">
                    {service.name}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#334155]">
                    {service.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Duration
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#334155]">
                        {service.duration} minutes
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-400">
                        Price
                      </p>

                      <p className="mt-1 text-lg font-bold text-[#0EA5E9]">
                        {service.price === null ? "Price not set" : `R${service.price}`}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/providers/${encodeURIComponent(provider.id)}/book?service=${encodeURIComponent(service.id)}`}
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#0EA5E9] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_0_0_rgba(14,165,233,0)] transition-all duration-200 hover:bg-[#38BDF8] hover:shadow-[0_0_20px_-4px_rgba(14,165,233,0.5)]"
                >
                  Book appointment
                </Link>
              </article>
            ))}
          </div>

          {totalServicePages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setServicePageState({ id: id ?? "", page: Math.max(1, servicePage - 1) })}
                disabled={servicePage === 1}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-[#0EA5E9] hover:text-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from({ length: totalServicePages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setServicePageState({ id: id ?? "", page })}
                  className={`h-10 w-10 rounded-lg text-sm font-semibold transition-colors ${
                    servicePage === page
                      ? "bg-[#0EA5E9] text-white shadow-[0_4px_14px_-4px_rgba(14,165,233,0.5)]"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-[#0EA5E9] hover:text-[#0EA5E9]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setServicePageState({ id: id ?? "", page: Math.min(totalServicePages, servicePage + 1) })}
                disabled={servicePage === totalServicePages}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-[#0EA5E9] hover:text-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}