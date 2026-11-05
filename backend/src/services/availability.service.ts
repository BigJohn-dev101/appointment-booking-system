export type AvailabilityWindow = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  active: boolean;
};

export type BookedRange = {
  start: Date;
  durationMinutes: number;
};

export type AppointmentSlot = {
  startsAt: Date;
  status: "AVAILABLE" | "BOOKED";
};

export function timeRangesOverlap(
  firstStart: Date,
  firstDurationMinutes: number,
  secondStart: Date,
  secondDurationMinutes: number,
): boolean {
  const firstEnd = firstStart.getTime() + firstDurationMinutes * 60_000;
  const secondEnd = secondStart.getTime() + secondDurationMinutes * 60_000;
  return firstStart.getTime() < secondEnd && firstEnd > secondStart.getTime();
}

export function parseLocalDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  date.setHours(0, 0, 0, 0);
  return date;
}

function parseMinutes(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function intersectAvailabilityWindows(
  businessWindows: AvailabilityWindow[],
  staffWindows: AvailabilityWindow[],
  dayOfWeek: number,
): AvailabilityWindow[] {
  const businessDay = businessWindows.filter((window) => window.active && window.dayOfWeek === dayOfWeek);
  const staffDay = staffWindows.filter((window) => window.active && window.dayOfWeek === dayOfWeek);

  if (staffWindows.length === 0) {
    return businessDay;
  }

  return businessDay.flatMap((business) => staffDay.flatMap((staff) => {
    const businessStart = parseMinutes(business.startTime);
    const businessEnd = parseMinutes(business.endTime);
    const staffStart = parseMinutes(staff.startTime);
    const staffEnd = parseMinutes(staff.endTime);
    if (businessStart === null || businessEnd === null || staffStart === null || staffEnd === null) return [];

    const start = Math.max(businessStart, staffStart);
    const end = Math.min(businessEnd, staffEnd);
    if (start >= end) return [];

    return [{
      dayOfWeek,
      startTime: `${String(Math.floor(start / 60)).padStart(2, "0")}:${String(start % 60).padStart(2, "0")}`,
      endTime: `${String(Math.floor(end / 60)).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}`,
      active: true,
    }];
  }));
}

export function generateAppointmentSlots(input: {
  date: string;
  durationMinutes: number;
  availability: AvailabilityWindow[];
  bookedRanges: BookedRange[];
  now?: Date;
}): AppointmentSlot[] {
  const date = parseLocalDate(input.date);
  if (!date || !Number.isInteger(input.durationMinutes) || input.durationMinutes <= 0) return [];

  const now = input.now ?? new Date();
  const dayOfWeek = date.getDay();
  const slots: AppointmentSlot[] = [];

  for (const window of input.availability) {
    if (!window.active || window.dayOfWeek !== dayOfWeek) continue;
    const windowStart = parseMinutes(window.startTime);
    const windowEnd = parseMinutes(window.endTime);
    if (windowStart === null || windowEnd === null || windowStart >= windowEnd) continue;

    for (let startMinute = windowStart; startMinute + input.durationMinutes <= windowEnd; startMinute += input.durationMinutes) {
      const startsAt = new Date(date);
      startsAt.setMinutes(startMinute);
      if (startsAt <= now) continue;

      const isBooked = input.bookedRanges.some((booking) =>
        timeRangesOverlap(startsAt, input.durationMinutes, booking.start, booking.durationMinutes),
      );

      slots.push({ startsAt, status: isBooked ? "BOOKED" : "AVAILABLE" });
    }
  }

  return slots.sort((left, right) => left.startsAt.getTime() - right.startsAt.getTime());
}
