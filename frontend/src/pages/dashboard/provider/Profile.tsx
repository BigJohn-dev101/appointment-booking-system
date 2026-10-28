import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  const profile = user?.soleProvider;

  if (!user || !profile) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        Provider profile details are not available.
      </div>
    );
  }

  const fields = [
    { label: "Name", value: profile.displayName },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
    { label: "Service", value: profile.serviceName },
    { label: "Category", value: profile.category },
    { label: "Experience", value: profile.experience },
    { label: "City or service area", value: profile.city },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My profile</h1>
          <p className="mt-1 text-slate-500">Review your account and public provider details.</p>
        </div>
        <Link
          to={`/providers/${profile.id}`}
          className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          View public profile
        </Link>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h2 className="font-semibold text-slate-900">Provider information</h2>
        </div>
        <dl className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-sm text-slate-500">{label}</dt>
              <dd className="mt-1 font-medium text-slate-900">{value || "Not provided"}</dd>
            </div>
          ))}
          <div className="sm:col-span-2">
            <dt className="text-sm text-slate-500">About</dt>
            <dd className="mt-1 whitespace-pre-wrap font-medium text-slate-900">
              {profile.bio || "Not provided"}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}