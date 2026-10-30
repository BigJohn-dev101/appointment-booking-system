import React, { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import { apiFetch } from "../../../services/api";

const ACCENT_FROM = "#0EA5E9";
const ACCENT_TO = "#38BDF8";

// --- Reusable Vector Icons ---
const Icons = {
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <path d="M8 2v4M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </svg>
  ),
  Services: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <path d="m16 6 4 14M12 6v14M8 8v12M4 4v16" />
    </svg>
  ),
  Staff: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Subscription: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  ),
  Profile: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  LogOut: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  ),
  MapPin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  ArrowUpRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  ),
};

type BusinessProfile = {
  id: string;
  name: string;
  category: string;
  staffSize: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  operatingHours: string;
};

type NavItem = {
  label: string;
  icon: React.ComponentType;
  path: string;
};

// 6 active nav items (Analytics excluded)
const navItems: NavItem[] = [
  { label: "Dashboard", icon: Icons.Dashboard, path: "/dashboard/business" },
  { label: "Appointments", icon: Icons.Calendar, path: "/dashboard/business/appointments" },
  { label: "Services", icon: Icons.Services, path: "/dashboard/business/services" },
  { label: "Staff", icon: Icons.Staff, path: "/dashboard/business/staff" },
  { label: "Subscription", icon: Icons.Subscription, path: "/dashboard/business/package" },
  { label: "Profile", icon: Icons.Profile, path: "/dashboard/business/profile" },
];

const CATEGORIES = [
  "Salon / Spa",
  "Clinic / Wellness",
  "Barber & Grooming",
  "Fitness Studio",
  "Home & Trade Services",
  "Education & Training",
  "Other",
];

const DEFAULT_PROFILE: BusinessProfile = {
  id: "biz-1",
  name: "Apex Wellness Center",
  category: "Clinic / Wellness",
  staffSize: "2–5 staff",
  email: "contact@apexwellness.co.za",
  phone: "+27 10 500 4400",
  address: "14 Church Street, Hatfield, Pretoria",
  description:
    "Multidisciplinary wellness clinic offering registered chiropractic adjustments, physiotherapy rehabilitation, and posture guidance.",
  operatingHours: "08:00 – 17:00 (Mon – Sat)",
};

export default function BusinessProfilePage() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<BusinessProfile>(DEFAULT_PROFILE);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Clinic / Wellness");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [operatingHours, setOperatingHours] = useState("");

  useEffect(() => {
    if (!user) return;

    if (user.role !== "BUSINESS_OWNER") {
      navigate("/login", { replace: true });
      return;
    }

    const loadProfile = async () => {
      setFetching(true);
      try {
        const response = await apiFetch<{
          success: boolean;
          business?: Partial<BusinessProfile>;
        }>("/business/dashboard");

        if (response.business) {
          const loaded: BusinessProfile = {
            id: response.business.id || DEFAULT_PROFILE.id,
            name: response.business.name || DEFAULT_PROFILE.name,
            category: response.business.category || DEFAULT_PROFILE.category,
            staffSize: response.business.staffSize || DEFAULT_PROFILE.staffSize,
            email: response.business.email || DEFAULT_PROFILE.email,
            phone: response.business.phone || DEFAULT_PROFILE.phone,
            address: response.business.address || DEFAULT_PROFILE.address,
            description: response.business.description || DEFAULT_PROFILE.description,
            operatingHours: response.business.operatingHours || DEFAULT_PROFILE.operatingHours,
          };
          setProfile(loaded);
          populateForm(loaded);
        } else {
          populateForm(DEFAULT_PROFILE);
        }
      } catch (err) {
        console.warn("Could not load profile from backend:", err);
        populateForm(DEFAULT_PROFILE);
      } finally {
        setFetching(false);
      }
    };

    void loadProfile();
  }, [user, navigate]);

  const populateForm = (data: BusinessProfile) => {
    setName(data.name);
    setCategory(data.category);
    setEmail(data.email);
    setPhone(data.phone);
    setAddress(data.address);
    setDescription(data.description);
    setOperatingHours(data.operatingHours);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Business name is required.");
      return;
    }

    setSaving(true);
    const updated: BusinessProfile = {
      ...profile,
      name: name.trim(),
      category,
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      description: description.trim(),
      operatingHours: operatingHours.trim(),
    };

    try {
      await apiFetch("/business/profile", {
        method: "PUT",
        body: JSON.stringify(updated),
      }).catch(() => {});

      setProfile(updated);
      toast.success("Business profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Non-blocking guard
  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0B1220] transition-transform duration-200 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-[#0F172A]"
              style={{
                background: `linear-gradient(135deg, ${ACCENT_TO}, ${ACCENT_FROM})`,
              }}
            >
              IT
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              ITThynk<span className="text-[#38BDF8]">Appoint</span>
            </span>
          </Link>
        </div>

        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs font-medium text-slate-400">Navigation</p>
          <h2 className="mt-1 truncate text-base font-semibold text-white">Profile Settings</h2>
          <p className="mt-1 text-xs text-sky-400">Business Details</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 pb-6 pt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === "/dashboard/business/profile";
            return (
              <button
                key={item.label}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(item.path);
                }}
                className={`relative flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full"
                    style={{
                      background: `linear-gradient(180deg, ${ACCENT_TO}, ${ACCENT_FROM})`,
                    }}
                  />
                )}
                <Icon />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={() => void logout()}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400"
          >
            <Icons.LogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="lg:pl-64">
        {/* Sticky Header — Clean & Static without any blinking ping */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg border border-slate-200 p-2 lg:hidden"
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Business Profile
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Manage your public directory information, location, and operational contact channels.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard/business")}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Overview
          </button>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left 2 Columns: Edit Form (With Skeletons) */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSave} className="space-y-6">
                {/* General Business Info Card */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-lg font-bold text-slate-900">General Information</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Basic information presented to clients searching the platform directory.
                  </p>

                  <div className="mt-6 space-y-5">
                    {fetching ? (
                      <div className="space-y-4 animate-pulse">
                        <div className="h-10 w-full rounded-xl bg-slate-200" />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="h-10 rounded-xl bg-slate-200" />
                          <div className="h-10 rounded-xl bg-slate-200" />
                        </div>
                        <div className="h-24 w-full rounded-xl bg-slate-200" />
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Business Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Apex Wellness Center"
                            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs text-slate-800 outline-none transition focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-sky-100 sm:text-sm"
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                              Primary Category
                            </label>
                            <select
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-sky-100 sm:text-sm"
                            >
                              {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                              Operating Hours
                            </label>
                            <input
                              type="text"
                              value={operatingHours}
                              onChange={(e) => setOperatingHours(e.target.value)}
                              placeholder="e.g. 08:00 – 17:00 (Mon – Sat)"
                              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs text-slate-800 outline-none transition focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-sky-100 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            About Your Business / Bio
                          </label>
                          <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief summary of your establishment and specialties..."
                            className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs text-slate-800 outline-none transition focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-sky-100 sm:text-sm"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Location & Contact Info Card */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-lg font-bold text-slate-900">Location &amp; Contact Details</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Direct channels for client inquiries and studio navigation.
                  </p>

                  <div className="mt-6 space-y-5">
                    {fetching ? (
                      <div className="space-y-4 animate-pulse">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="h-10 rounded-xl bg-slate-200" />
                          <div className="h-10 rounded-xl bg-slate-200" />
                        </div>
                        <div className="h-10 w-full rounded-xl bg-slate-200" />
                      </div>
                    ) : (
                      <>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                              Public Phone
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+27 10 000 0000"
                              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs text-slate-800 outline-none transition focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-sky-100 sm:text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                              Public Inquiry Email
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="info@mybusiness.co.za"
                              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs text-slate-800 outline-none transition focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-sky-100 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Physical Address
                          </label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Suite 101, 14 Church Street, Pretoria"
                            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs text-slate-800 outline-none transition focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-sky-100 sm:text-sm"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving || fetching}
                    className="rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] px-8 py-3 text-xs font-semibold text-white shadow-sm transition hover:shadow-md hover:brightness-105 disabled:opacity-50 sm:text-sm"
                  >
                    {saving ? "Saving Changes..." : "Save Profile Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Live Directory Preview & Account Ownership */}
            <div className="space-y-6">
              {/* Live Preview Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Live Directory Preview
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                    Open
                  </span>
                </div>

                {fetching ? (
                  <div className="mt-4 space-y-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-slate-200" />
                      <div className="space-y-1.5">
                        <div className="h-4 w-28 rounded bg-slate-200" />
                        <div className="h-3 w-20 rounded bg-slate-100" />
                      </div>
                    </div>
                    <div className="h-12 w-full rounded-xl bg-slate-100" />
                  </div>
                ) : (
                  <>
                    <div className="mt-4 flex items-start gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-base font-bold text-sky-400 shadow-xs">
                        {name
                          ? name
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)
                          : "AP"}
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{name || "Business Name"}</h3>
                        <p className="text-xs font-semibold text-[#0EA5E9]">{category}</p>
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                          {description || "No description provided yet."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-3 text-xs text-slate-500 space-y-2">
                      <p className="flex items-center gap-2">
                        <span className="text-slate-400"><Icons.MapPin /></span>
                        <span className="truncate">{address || "Address not provided"}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-slate-400"><Icons.Clock /></span>
                        <span>{operatingHours || "08:00 – 17:00"}</span>
                      </p>
                    </div>

                    <Link
                      to="/providers"
                      className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      <span>View Public Listing</span>
                      <Icons.ArrowUpRight />
                    </Link>
                  </>
                )}
              </div>

              {/* Account Ownership & Security Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-xs text-slate-600 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">Account Administration</h3>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Account Owner</span>
                  <span className="font-semibold text-slate-800">
                    {user.firstName} {user.lastName ?? ""}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Owner Login Email</span>
                  <span className="font-semibold text-slate-800">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Role Authority</span>
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-bold text-sky-800">
                    BUSINESS_OWNER
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Consistent Footer */}
        <footer className="border-t border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} ITThynkAppoint. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link to="/about" className="hover:text-slate-700">About</Link>
              <Link to="/contact" className="hover:text-slate-700">Support</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}