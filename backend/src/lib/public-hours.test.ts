import assert from "node:assert/strict";
import test from "node:test";
import { formatPublicHours, type AvailabilityWindow } from "./public-hours.js";

const windowFor = (dayOfWeek: number, startTime: string, endTime: string, active = true): AvailabilityWindow => ({
  dayOfWeek,
  startTime,
  endTime,
  active,
});

test("groups identical weekday hours into a compact range", () => {
  assert.equal(formatPublicHours([
    windowFor(1, "09:00", "17:00"),
    windowFor(2, "09:00", "17:00"),
    windowFor(3, "09:00", "17:00"),
    windowFor(4, "09:00", "17:00"),
    windowFor(5, "09:00", "17:00"),
  ]), "Mon-Fri 09:00-17:00");
});

test("keeps different daily schedules distinct and groups matching split ranges", () => {
  assert.equal(formatPublicHours([
    windowFor(1, "09:00", "12:00"),
    windowFor(1, "13:00", "17:00"),
    windowFor(2, "09:00", "12:00"),
    windowFor(2, "13:00", "17:00"),
    windowFor(6, "10:00", "14:00"),
  ]), "Mon-Tue 09:00-12:00, 13:00-17:00 · Sat 10:00-14:00");
});

test("omits inactive days and returns a fallback when no hours are active", () => {
  assert.equal(formatPublicHours([windowFor(1, "09:00", "17:00", false)]), "Hours not set");
});