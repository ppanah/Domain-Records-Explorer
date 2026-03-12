import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce } from "../utils/debounce";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls the function after the specified delay", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced("hello");
    // function should not be called immediately
    expect(fn).not.toHaveBeenCalled();

    // Fast-forward time
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("hello");
  });

  it("only calls the last function if called multiple times quickly", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced("first");
    debounced("second");
    debounced("third");

    // None called yet
    expect(fn).not.toHaveBeenCalled();

    // Fast-forward time
    vi.advanceTimersByTime(200);

    expect(fn).toHaveBeenCalledTimes(1);
    // Only the last call arguments
    expect(fn).toHaveBeenCalledWith("third");
  });

  it("defaults delay to 300ms if not specified", () => {
    const fn = vi.fn();
    const debounced = debounce(fn);

    debounced("test");

    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("test");
  });

  it("forwards multiple arguments correctly", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced(1, 2, 3);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith(1, 2, 3);
  });
});
