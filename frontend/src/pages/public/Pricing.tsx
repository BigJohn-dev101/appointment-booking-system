type Plan = {
  name: string;
  price: string;
  description: string;
  cta: string;
  popular?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "Free",
    description:
      "Perfect for solo professionals who are booking their first clients.",
    cta: "Get started",
    features: [
      "Up to 10 bookings per day",
      "1 staff profile",
      "Online booking page",
      "Basic calendar management",
    ],
  },
  {
    name: "Growth",
    price: "R199",
    description:
      "Built for busy businesses ready to scale operations smoothly.",
    cta: "Choose Growth",
    popular: true,
    features: [
      "Unlimited appointments",
      "Up to 15 team members",
      "Business dashboard",
      "Analytics and reports",
      "Priority email support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description:
      "Advanced scheduling, automation, and support for larger teams.",
    cta: "Talk to sales",
    features: [
      "Unlimited staff access",
      "Multi-location scheduling",
      "Advanced reporting",
      "Dedicated onboarding",
      "Custom integrations",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="bg-[#F8FAFC] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-[#0EA5E9]">
            Flexible plans
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#0F172A] sm:text-5xl">
            Simple, transparent pricing
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#334155]">
            Choose a plan that matches your workflow and start managing
            bookings with less stress and more control.
          </p>
        </div>

        {/* Plans */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-3xl bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl ${
                plan.popular
                  ? "border-2 border-[#0EA5E9] shadow-lg shadow-sky-100"
                  : "border border-slate-200"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <span className="absolute right-6 top-6 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#0EA5E9]">
                  Most popular
                </span>
              )}

              <div>
                <h2 className="text-2xl font-semibold text-[#0F172A]">
                  {plan.name}
                </h2>

                <p className="mt-4 min-h-[72px] text-sm leading-7 text-[#334155]">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mt-8 flex items-end gap-2">
                <span className="text-4xl font-bold tracking-tight text-[#0F172A]">
                  {plan.price}
                </span>

                {plan.price !== "Custom" && (
                  <span className="pb-1 text-sm text-slate-500">
                    /month
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="mt-8 flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-[#334155]"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-[#22C55E]">
                      ✓
                    </span>

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                type="button"
                className={`mt-9 w-full rounded-xl px-5 py-3.5 text-sm font-semibold transition ${
                  plan.popular
                    ? "bg-[#0EA5E9] text-white hover:bg-sky-600"
                    : "border border-slate-300 bg-white text-[#0F172A] hover:border-[#0EA5E9] hover:text-[#0EA5E9]"
                }`}
              >
                {plan.cta}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}