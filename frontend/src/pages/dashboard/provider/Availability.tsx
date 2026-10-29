// src/pages/dashboard/provider/Availability.tsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "../../../services/api"; // Adjust path if needed

const ACCENT_FROM = "#0EA5E9";
const ACCENT_TO = "#38BDF8";

type DaySchedule = {
  isEnabled: boolean;
  startTime: string;
  endTime: string;
};

type WeeklySchedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
};

const DEFAULT_SCHEDULE: WeeklySchedule = {
  monday: { isEnabled: true, startTime: "09:00", endTime: "17:00" },
  tuesday: { isEnabled: true, startTime: "09:00", endTime: "17:00" },
  wednesday: { isEnabled: true, startTime: "09:00", endTime: "17:00" },
  thursday: { isEnabled: true, startTime: "09:00", endTime: "17:00" },
  friday: { isEnabled: true, startTime: "09:00", endTime: "17:00" },
  saturday: { isEnabled: false, startTime: "09:00", endTime: "13:00" },
  sunday: { isEnabled: false, startTime: "09:00", endTime: "13:00" },
};

export default function Availability() {
  const [schedule, setSchedule] = useState<WeeklySchedule>(DEFAULT_SCHEDULE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch current availability from backend
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const data = await apiFetch<{ schedule: WeeklySchedule }>("/provider/availability");
        if (data && data.schedule) {
          setSchedule(data.schedule);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.log("No existing availability found, using defaults.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  // Handle toggle for a specific day
  const toggleDay = (day: keyof WeeklySchedule) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], isEnabled: !prev[day].isEnabled },
    }));
  };

  // Handle time change for a specific day
  const handleTimeChange = (day: keyof WeeklySchedule, field: "startTime" | "endTime", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  // Save to backend
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiFetch("/provider/availability", {
        method: "PUT", // or POST depending on your backend route
        body: JSON.stringify({ schedule }),
      });
      toast.success("Availability updated successfully!");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to update availability. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading your schedule...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Availability</h1>
          <p className="text-slate-500 mt-1">Set the days and times customers can book you.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-[#0F172A] shadow-sm transition hover:brightness-105 disabled:opacity-50"
          style={{ background: `linear-gradient(135deg, ${ACCENT_TO}, ${ACCENT_FROM})` }}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Schedule Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Weekly Schedule</h2>
          <p className="text-xs text-slate-500">All times are in your local timezone.</p>
        </div>

        <div className="divide-y divide-slate-100">
          {(Object.keys(schedule) as Array<keyof WeeklySchedule>).map((day) => {
            const dayData = schedule[day];
            return (
              <div key={day} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                
                {/* Day Name & Toggle */}
                <div className="flex items-center gap-4 w-40">
                  <button
                    onClick={() => toggleDay(day)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                      dayData.isEnabled ? "bg-sky-500" : "bg-slate-200"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${dayData.isEnabled ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <span className={`font-medium capitalize ${dayData.isEnabled ? "text-slate-900" : "text-slate-400"}`}>
                    {day}
                  </span>
                </div>

                {/* Time Inputs */}
                <div className={`flex items-center gap-2 ${!dayData.isEnabled ? "opacity-50 pointer-events-none" : ""}`}>
                  <input
                    type="time"
                    value={dayData.startTime}
                    onChange={(e) => handleTimeChange(day, "startTime", e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="time"
                    value={dayData.endTime}
                    onChange={(e) => handleTimeChange(day, "endTime", e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>

              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-6 bg-sky-50 border border-sky-100 rounded-xl p-4 flex gap-3 text-sm text-sky-800">
        <span className="text-lg">
          
        </span>
        <p>Changes to your availability will immediately affect what customers can see and book on your public profile.</p>
      </div>

    </div>
  );
}