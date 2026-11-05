import assert from "node:assert/strict";
import test from "node:test";
import { capitalizeBusinessName } from "./business-name.js";

test("capitalizes the first letter of each business name word", () => {
  assert.equal(capitalizeBusinessName("northside family clinic"), "Northside Family Clinic");
});

test("capitalizes words separated by punctuation and whitespace", () => {
  assert.equal(capitalizeBusinessName("  o'brien-health studio  "), "O'Brien-Health Studio");
});
