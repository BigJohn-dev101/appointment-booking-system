// src/pages/dashboard/provider/Appointments.tsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "../../../services/api";
import Calender from "../../../components/calendar/Calender";

type Appointment = {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  date: string; // ISO string
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  notes?: string;
};

const appointmentTabs = ["UPCOMING", "COMPLETED", "CANCELLED"] as const;

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<"UPCOMING" | "COMPLETED" | "CANCELLED">("UPCOMING");
  const [viewMode, setViewMode] = useState<"LIST" | "CALENDAR">("LIST"); // NEW: View Toggle
  const [isLoading, setIsLoading] = useState(true);

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const data = await apiFetch<Appointment[]>(`/provider/appointments?status=${activeTab}`);
      setAppointments(data);
    } catch (error) {
      console.error("Provider appointments fetch failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    void apiFetch<Appointment[]>(`/provider/appointments?status=${activeTab}`)
      .then((data) => {
        if (isMounted) setAppointments(data);
      })
      .catch((error: unknown) => {
        console.error("Provider appointments fetch failed:", error);
        if (isMounted) {
          toast.error(error instanceof Error ? error.message : "Failed to load appointments");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  // Update Status
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await apiFetch(`/provider/appointments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(`Appointment marked as ${newStatus.toLowerCase()}`);
      fetchAppointments(); 
    } catch (error) {
      console.error("Provider appointment status update failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update appointment");
    }
  };

  return (
    // Changed max-w-5xl to max-w-7xl to give the calendar more room
    <div className="max-w-7xl mx-auto">
      
      {/* Header with View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="text-slate-500 mt-1">View and manage your customer bookings.</p>
        </div>

        {/* NEW: Toggle between List and Calendar */}
        <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
          <button 
            onClick={() => setViewMode("LIST")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${viewMode === "LIST" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
          >
            List View
          </button>
          <button 
            onClick={() => setViewMode("CALENDAR")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${viewMode === "CALENDAR" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
          >
            Calendar View
          </button>
        </div>
      </div>

      {/* Conditionally Render based on View Mode */}
      {viewMode === "CALENDAR" ? (
        <Calender appointments={appointments} />
      ) : (
        <>
          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-6">
            {appointmentTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setIsLoading(true);
                  setActiveTab(tab);
                }}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-sky-500 text-sky-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                  <span className="text-xl">▣</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No {activeTab.toLowerCase()} appointments</h3>
                <p className="text-slate-500 max-w-sm mx-auto">When customers book you, they will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {appointments.map((apt) => {
                  const dateObj = new Date(apt.date);
                  return (
                    <div key={apt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                      <div className="flex items-start gap-4">
                        {/* Date Block */}
                        <div className="flex flex-col items-center justify-center bg-sky-50 text-sky-700 rounded-xl px-3 py-2 min-w-[70px]">
                          <span className="text-xs font-semibold uppercase">{dateObj.toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-xl font-bold leading-none">{dateObj.getDate()}</span>
                        </div>
                        
                        {/* Details */}
                        <div>
                          <h3 className="font-semibold text-slate-900">{apt.serviceName}</h3>
                          <p className="text-sm text-slate-600 mt-0.5">with {apt.customerName}</p>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            ⏱ {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      {/* Actions based on status */}
                      <div className="flex items-center gap-2 sm:justify-end">
                        {apt.status === "UPCOMING" && (
                          <>
                            <button onClick={() => handleStatusUpdate(apt.id, "COMPLETED")} className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition">
                              Mark Completed
                            </button>
                            <button onClick={() => handleStatusUpdate(apt.id, "CANCELLED")} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition">
                              Cancel
                            </button>
                          </>
                        )}
                        
                        {apt.status === "COMPLETED" && (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Completed
                          </span>
                        )}

                        {apt.status === "CANCELLED" && (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}