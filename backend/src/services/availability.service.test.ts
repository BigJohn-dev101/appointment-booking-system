import assert from "node:assert/strict";
import test from "node:test";
import {
  generateAppointmentSlots,
  intersectAvailabilityWindows,
  parseLocalDate,
  timeRangesOverlap,
  type AvailabilityWindow,
} from "./availability.service.js";

const monday: AvailabilityWindow = {
  dayOfWeek: 1,
  startTime: "09:00",
  endTime: "12:00",
  active: true,
};

function localTime(date: string, hour: number, minute: number): Date {
  const parsed = parseLocalDate(date)!;
  parsed.setHours(hour, minute, 0, 0);
  return parsed;
}

test("rejects malformed and impossible local dates", () => {
  assert.equal(parseLocalDate("2030-02-30"), null);
  assert.equal(parseLocalDate("2030/02/04"), null);
});

test("creates starts at the service duration interval and requires the full duration to fit", () => {
  const slots = generateAppointmentSlots({
    date: "2030-01-07",
    durationMinutes: 45,
    availability: [monday],
    bookedRanges: [],
    now: new Date("2029-01-01T00:00:00"),
  });

  assert.deepEqual(slots.map((slot) => `${slot.startsAt.getHours()}:${String(slot.startsAt.getMinutes()).padStart(2, "0")}`), [
    "9:00",
    "9:45",
    "10:30",
    "11:15",
  ]);
});

test("marks duration overlaps with existing appointments as booked", () => {
  const slots = generateAppointmentSlots({
    date: "2030-01-07",
    durationMinutes: 45,
    availability: [monday],
    bookedRanges: [{ start: localTime("2030-01-07", 9, 30), durationMinutes: 30 }],
    now: new Date("2029-01-01T00:00:00"),
  });

  assert.deepEqual(slots.map((slot) => slot.status), ["BOOKED", "BOOKED", "AVAILABLE", "AVAILABLE"]);
});

test("detects overlapping intervals but allows appointments that meet at a boundary", () => {
  const start = localTime("2030-01-07", 9, 0);
  assert.equal(timeRangesOverlap(start, 60, localTime("2030-01-07", 9, 30), 30), true);
  assert.equal(timeRangesOverlap(start, 30, localTime("2030-01-07", 9, 30), 30), false);
});

test("omits past slots for the current day", () => {
  const slots = generateAppointmentSlots({
    date: "2030-01-07",
    durationMinutes: 30,
    availability: [monday],
    bookedRanges: [],
    now: localTime("2030-01-07", 9, 30),
  });

  assert.equal(slots[0]?.startsAt.getHours(), 10);
});

test("intersects business and staff weekly hours", () => {
  const windows = intersectAvailabilityWindows(
    [{ ...monday, startTime: "08:30", endTime: "17:00" }],
    [{ ...monday, startTime: "09:15", endTime: "15:30" }],
    1,
  );

  assert.deepEqual(windows, [{ dayOfWeek: 1, startTime: "09:15", endTime: "15:30", active: true }]);
});
