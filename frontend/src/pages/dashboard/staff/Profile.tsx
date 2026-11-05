import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { fetchStaffProfile, updateStaffProfile, type StaffProfile as StaffProfileData } from "../../../services/staff";

export default function StaffProfile() {
  const [profile, setProfile] = useState<StaffProfileData | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    void fetchStaffProfile()
      .then(({ profile: data }) => {
        if (!active) return;
        setProfile(data);
        setFirstName(data.firstName);
        setLastName(data.lastName ?? "");
        setPhone(data.phone ?? "");
      })
      .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Unable to load your profile."))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await updateStaffProfile({ firstName: firstName.trim(), lastName: lastName.trim() || null, phone: phone.trim() || null });
      setProfile(response.profile);
      toast.success("Your profile was updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="h-72 animate-pulse rounded-xl bg-white" role="status" aria-label="Loading profile" />;
  if (!profile) return <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Staff profile could not be loaded.</p>;

  const inputClass = "mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-100";
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6"><h2 className="font-[Clash_Display] text-2xl font-bold text-slate-950">My profile</h2><p className="mt-1 text-sm text-slate-600">Update your staff contact details.</p></div>
      <form onSubmit={save} className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">First name<input required maxLength={50} value={firstName} onChange={(event) => setFirstName(event.target.value)} className={inputClass} /></label>
          <label className="text-sm font-semibold text-slate-700">Last name<input maxLength={80} value={lastName} onChange={(event) => setLastName(event.target.value)} className={inputClass} /></label>
          <label className="text-sm font-semibold text-slate-700">Email<input value={profile.email} readOnly aria-readonly="true" className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`} /></label>
          <label className="text-sm font-semibold text-slate-700">Phone<input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+27 82 000 0000" className={inputClass} /></label>
          <label className="text-sm font-semibold text-slate-700">Position<input value={profile.title ?? "Staff"} readOnly aria-readonly="true" className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`} /></label>
          <label className="text-sm font-semibold text-slate-700">Business<input value={profile.businessName} readOnly aria-readonly="true" className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`} /></label>
        </div>
        <div className="flex justify-end border-t border-slate-100 pt-4"><button type="submit" disabled={saving} className="rounded-md bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-60">{saving ? "Saving…" : "Save profile"}</button></div>
      </form>
    </div>
  );
}
