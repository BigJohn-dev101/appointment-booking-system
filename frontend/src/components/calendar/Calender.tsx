// src/components/calendar/Calender.tsx
import { useState } from "react";
import WeekView, { type Appointment } from "./WeekView";

type CalenderProps = {
  appointments: Appointment[];
};

export default function Calender({ appointments }: CalenderProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Navigation logic
  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Format for the header title (e.g., "Oct 22 - Oct 28, 2023")
  const getWeekRangeString = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return `${start.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Today
          </button>
          <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden">
            <button onClick={handlePreviousWeek} className="p-2 hover:bg-slate-50 border-r border-slate-300 text-slate-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={handleNextWeek} className="p-2 hover:bg-slate-50 text-slate-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-800">
          {getWeekRangeString()}
        </h2>
      </div>

      {/* The actual calendar grid */}
      <WeekView currentDate={currentDate} appointments={appointments} />
    </div>
  );
}