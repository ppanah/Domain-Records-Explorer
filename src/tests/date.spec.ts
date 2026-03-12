import { describe, it, expect } from "vitest";
import { formatDate } from "../utils/date";

describe("formatDate", () => {
  it("formats a valid date string correctly", () => {
    const formatted = formatDate("2023-03-11");
    // Just check it contains year, month, day (more timezone safe)
    expect(formatted).toContain("2023");
    expect(
      /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/.test(formatted),
    ).toBe(true);
    expect(/\d{1,2}/.test(formatted)).toBe(true);
  });

  it('returns "Invalid Date" for invalid date string', () => {
    const formatted = formatDate("invalid-date");
    expect(formatted).toBe("Invalid Date");
  });

  it("handles empty string", () => {
    const formatted = formatDate("");
    expect(formatted).toBe("Invalid Date");
  });
});
