import { Link, useParams } from "react-router-dom";

import { providers } from "../../../data/providers";

export default function ProviderProfile() {
  const { id } = useParams();

  const provider = providers.find(
    (provider) => provider.id === Number(id)
  );

  if (!provider) {
    return (
      <section className="min-h-[60vh] bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <h1 className="text-3xl font-bold text-[#0F172A]">
              Provider not found
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              The provider you are looking for does not exist or is no longer
              available.
            </p>

            <Link
              to="/providers"
              className="mt-6 inline-flex rounded-xl bg-[#0EA5E9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
            >
              Back to providers
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const isOpen = provider.status === "Open";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Provider heading */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <Link
            to="/providers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0EA5E9] transition hover:text-sky-700"
          >
            <span aria-hidden="true">←</span>
            Back to providers
          </Link>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#0F172A] text-xl font-bold text-white">
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

                <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#0F172A] sm:text-5xl">
                  {provider.name}
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-[#334155]">
                  {provider.description}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] px-5 py-4 md:min-w-52">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Business hours
              </p>

              <p className="mt-2 text-lg font-semibold text-[#0F172A]">
                {provider.hours}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#0EA5E9]">
                Services
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#0F172A]">
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
            {provider.services.map((service) => (
              <article
                key={service.id}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-slate-200/60"
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
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Duration
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#334155]">
                        {service.duration} minutes
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Price
                      </p>

                      <p className="mt-1 text-lg font-bold text-[#0EA5E9]">
                        R{service.price}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/providers/${provider.id}/book?service=${service.id}`}
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#0EA5E9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
                >
                  Book appointment
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}