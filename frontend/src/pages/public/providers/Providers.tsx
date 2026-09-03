import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  providers,
  type Provider,
} from "../../../data/providers";

export default function Providers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Generate categories from the mock provider data.
  // This means we do not need to maintain a second category list manually.
  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(providers.map((provider) => provider.category))
      ),
    ];
  }, []);

  // Filter providers using both the search query and selected category.
  const filteredProviders = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return providers.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(query) ||
        provider.category.toLowerCase().includes(query) ||
        provider.description.toLowerCase().includes(query) ||
        provider.services.some((service) =>
          service.name.toLowerCase().includes(query)
        );

      const matchesCategory =
        selectedCategory === "All" ||
        provider.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory("All");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#0EA5E9]">
              Providers
            </span>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#0F172A] sm:text-5xl">
              Find a service provider
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#334155]">
              Browse available businesses and independent providers, explore
              their services, and choose the provider that works for you.
            </p>
          </div>
        </div>
      </section>

      {/* Search and category filters */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-6">
            {/* Search */}
            <div className="relative max-w-2xl">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search providers or services..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-sm text-[#334155] outline-none transition placeholder:text-slate-400 focus:border-[#0EA5E9] focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isSelected = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(category)
                    }
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isSelected
                        ? "bg-[#0EA5E9] text-white shadow-sm"
                        : "border border-slate-200 bg-white text-[#334155] hover:border-[#0EA5E9] hover:text-[#0EA5E9]"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Provider results */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Results heading */}
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#0F172A]">
                Available providers
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredProviders.length}{" "}
                {filteredProviders.length === 1
                  ? "provider"
                  : "providers"}{" "}
                found
              </p>
            </div>

            {(searchQuery || selectedCategory !== "All") && (
              <button
                type="button"
                onClick={clearFilters}
                className="self-start text-sm font-semibold text-[#0EA5E9] transition hover:text-sky-700 sm:self-auto"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Provider cards */}
          {filteredProviders.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                />
              ))}
            </div>
          ) : (
            <EmptyState onClear={clearFilters} />
          )}
        </div>
      </section>
    </div>
  );
}

function ProviderCard({
  provider,
}: {
  provider: Provider;
}) {
  const isOpen = provider.status === "Open";

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-slate-200/60">
      {/* Provider header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#0F172A] text-sm font-bold text-white">
          {provider.initials}
        </div>

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

      {/* Provider information */}
      <div className="mt-6 flex-1">
        <h3 className="text-xl font-semibold text-[#0F172A]">
          {provider.name}
        </h3>

        <p className="mt-1 text-sm font-medium text-[#0EA5E9]">
          {provider.category}
        </p>

        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#334155]">
          {provider.description}
        </p>

        {/* Service preview */}
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Services
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {provider.services.slice(0, 2).map((service) => (
              <span
                key={service.id}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
              >
                {service.name}
              </span>
            ))}

            {provider.services.length > 2 && (
              <span className="rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-medium text-[#0EA5E9]">
                +{provider.services.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Business information */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Business hours
            </p>

            <p className="mt-1 text-sm font-semibold text-[#334155]">
              {provider.hours}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Services
            </p>

            <p className="mt-1 text-sm font-semibold text-[#334155]">
              {provider.services.length}
            </p>
          </div>
        </div>

        <Link
          to={`/providers/${provider.id}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          View services

          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

function EmptyState({
  onClear,
}: {
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#0F172A]">
        No providers found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        We couldn't find a provider matching your search. Try another
        service, provider name, or category.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-6 rounded-xl bg-[#0EA5E9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
      >
        Clear filters
      </button>
    </div>
  );
}