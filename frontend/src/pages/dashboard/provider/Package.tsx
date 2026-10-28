import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "../../../services/api";

type SubscriptionInfo = {
  tier: string;
  status: string;
  paymentStatus: string;
  dailyAppointmentLimit?: number | null;
  monthlyPrice?: number | string | null;
  nextBillingDate?: string | null;
};

type DashboardResponse = {
  subscription: SubscriptionInfo | null;
};

export default function Package() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await apiFetch<DashboardResponse>("/provider/dashboard");
        setSubscription(response.subscription);
      } catch (error) {
        console.error("Provider subscription fetch failed:", error);
        toast.error("Unable to load subscription details.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchSubscription();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading subscription...</div>;
  }

  const monthlyPrice = subscription?.monthlyPrice;
  const formattedPrice = monthlyPrice == null
    ? "Included with your plan"
    : new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "ZAR",
      }).format(Number(monthlyPrice));

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Subscription</h1>
        <p className="mt-1 text-slate-500">Review your current provider plan and billing details.</p>
      </div>

      {subscription ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-slate-500">Current plan</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">{subscription.tier}</h2>
            </div>
            <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              {subscription.status}
            </span>
          </div>

          <dl className="grid gap-6 p-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Monthly price</dt>
              <dd className="mt-1 font-semibold text-slate-900">{formattedPrice}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Payment status</dt>
              <dd className="mt-1 font-semibold text-slate-900">{subscription.paymentStatus}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Daily appointment limit</dt>
              <dd className="mt-1 font-semibold text-slate-900">
                {subscription.dailyAppointmentLimit ?? "No limit specified"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Next billing date</dt>
              <dd className="mt-1 font-semibold text-slate-900">
                {subscription.nextBillingDate
                  ? new Date(subscription.nextBillingDate).toLocaleDateString()
                  : "Not scheduled"}
              </dd>
            </div>
          </dl>
        </section>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">No active subscription</h2>
          <p className="mt-2 text-sm text-slate-500">
            There is currently no active plan linked to your provider account.
          </p>
        </section>
      )}
    </div>
  );
}