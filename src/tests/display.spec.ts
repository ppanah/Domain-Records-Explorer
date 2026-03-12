import { displayValue } from "../utils/display";
import { describe, it, expect } from "vitest";

describe("displayValue", () => {
  it("returns the value if it exists", () => {
    expect(displayValue("hello", "fallback")).toBe("hello");
  });

  it("returns fallback if value is null or undefined", () => {
    expect(displayValue(null, "fallback")).toBe("fallback");
    expect(displayValue(undefined, "fallback")).toBe("fallback");
  });
});
