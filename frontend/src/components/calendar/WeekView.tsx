// src/components/calendar/WeekView.tsx
import { useMemo } from "react";

export type Appointment = {
  id: string;
  customerName: string;
  serviceName: string;
  date: string; // ISO string e.g., "2023-10-25T14:30:00Z"
  status: string;
};

type WeekViewProps = {
  currentDate: Date;
  appointments: Appointment[];
};

export default function WeekView({ currentDate, appointments }: WeekViewProps) {
  // Work hours (8 AM to 6 PM)
  const START_HOUR = 8;
  const END_HOUR = 18;
  const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  // 1. Calculate the 7 days of the current week (starting on Sunday)
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay(); // 0 is Sunday
    startOfWeek.setDate(startOfWeek.getDate() - day); // Go back to Sunday
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  }, [currentDate]);

  // 2. Helper to position the appointment block based on its time
  const getAppointmentStyle = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Calculate how far from the top the appointment should be
    // 1 hour = 60px height. So 1 minute = 1px.
    const topOffset = (hours - START_HOUR) * 64 + (minutes);
    
    return {
      top: `${topOffset}px`,
      height: "60px", // Assuming most appointments are 1 hour for now
    };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col w-full h-[min(700px,calc(100vh_-_20rem))] min-h-[360px]">
      {/* Header Row (Days) */}
      <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50">
        <div className="p-3 text-xs font-semibold text-slate-400 text-center border-r border-slate-200 flex items-center justify-center">
          Time
        </div>
        {weekDays.map((day, idx) => {
          const isToday = new Date().toDateString() === day.toDateString();
          return (
            <div key={idx} className="p-3 text-center border-r border-slate-200 last:border-r-0">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                {day.toLocaleDateString('default', { weekday: 'short' })}
              </p>
              <p className={`text-lg font-bold mt-1 inline-flex items-center justify-center h-8 w-8 rounded-full ${isToday ? 'bg-sky-500 text-white' : 'text-slate-800'}`}>
                {day.getDate()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Scrollable Grid Area */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="grid grid-cols-8 h-full">
          
          {/* Time Column */}
          <div className="border-r border-slate-200 bg-slate-50/50">
            {HOURS.map((hour) => (
              <div key={hour} className="h-[64px] border-b border-slate-100 pr-2 text-right pt-2">
                <span className="text-xs font-medium text-slate-400">
                  {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </span>
              </div>
            ))}
          </div>

          {/* Days Columns */}
          {weekDays.map((day, idx) => (
            <div key={idx} className="border-r border-slate-200 last:border-r-0 relative">
              {/* Background Grid Lines */}
              {HOURS.map((hour) => (
                <div key={hour} className="h-[64px] border-b border-slate-100" />
              ))}

              {/* Render Appointments for this day */}
              {appointments
                .filter(apt => new Date(apt.date).toDateString() === day.toDateString())
                .map(apt => (
                  <div
                    key={apt.id}
                    className="absolute left-1 right-1 bg-sky-100 border border-sky-300 text-sky-900 rounded px-2 py-1 text-xs overflow-hidden shadow-sm hover:z-10 hover:shadow-md cursor-pointer transition"
                    style={getAppointmentStyle(apt.date)}
                    title={`${apt.serviceName} with ${apt.customerName}`}
                  >
                    <p className="font-bold truncate">{apt.customerName}</p>
                    <p className="truncate">{apt.serviceName}</p>
                  </div>
                ))}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}