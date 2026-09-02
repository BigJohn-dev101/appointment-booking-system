import { Link } from "react-router-dom";

export default function ProviderCTA() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-[#0F172A] px-6 py-14 text-center sm:px-12 lg:px-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#0EA5E9]">
            For service providers
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Offer services?
            <span className="block">
              Let customers book you online.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
            Create your provider profile, list your services, manage your
            availability and receive customer appointments from one place.
          </p>

          <Link
            to="/register/provider"
            className="mt-8 inline-flex rounded-xl bg-[#0EA5E9] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            List your services
          </Link>
        </div>
      </div>
    </section>
  );
}