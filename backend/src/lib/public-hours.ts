export type AvailabilityWindow = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  active: boolean;
};

const WEEKDAYS = [
  { day: 1, label: "Mon" },
  { day: 2, label: "Tue" },
  { day: 3, label: "Wed" },
  { day: 4, label: "Thu" },
  { day: 5, label: "Fri" },
  { day: 6, label: "Sat" },
  { day: 0, label: "Sun" },
];

function formatDayGroups(days: number[]): string {
  const positions = days
    .map((day) => WEEKDAYS.findIndex((entry) => entry.day === day))
    .filter((position) => position >= 0)
    .sort((left, right) => left - right);
  const groups: number[][] = [];

  for (const position of positions) {
    const currentGroup = groups.at(-1);
    if (currentGroup && position === currentGroup[currentGroup.length - 1]! + 1) {
      currentGroup.push(position);
    } else {
      groups.push([position]);
    }
  }

  return groups.map((group) => {
    const start = WEEKDAYS[group[0]!]!.label;
    const end = WEEKDAYS[group[group.length - 1]!]!.label;
    return group.length > 1 ? `${start}-${end}` : start;
  }).join(", ");
}

export function formatPublicHours(windows: AvailabilityWindow[]): string {
  const activeWindows = windows.filter((window) => window.active && window.dayOfWeek >= 0 && window.dayOfWeek <= 6);
  if (activeWindows.length === 0) return "Hours not set";

  const windowsByDay = new Map<number, AvailabilityWindow[]>();
  for (const window of activeWindows) {
    const dayWindows = windowsByDay.get(window.dayOfWeek) ?? [];
    dayWindows.push(window);
    windowsByDay.set(window.dayOfWeek, dayWindows);
  }

  const daysBySchedule = new Map<string, { days: number[]; ranges: string[]; firstPosition: number }>();
  for (const { day, label: _label } of WEEKDAYS) {
    const dayWindows = windowsByDay.get(day);
    if (!dayWindows?.length) continue;
    const ranges = dayWindows
      .map((window) => `${window.startTime}-${window.endTime}`)
      .sort((left, right) => left.localeCompare(right));
    const signature = ranges.join(",");
    const position = WEEKDAYS.findIndex((entry) => entry.day === day);
    const schedule = daysBySchedule.get(signature) ?? { days: [], ranges, firstPosition: position };
    schedule.days.push(day);
    daysBySchedule.set(signature, schedule);
  }

  return [...daysBySchedule.values()]
    .sort((left, right) => left.firstPosition - right.firstPosition)
    .map(({ days, ranges }) => `${formatDayGroups(days)} ${ranges.join(", ")}`)
    .join(" · ");
}