import { describe, it, expect } from "vitest";
import { canTransition, getAvailableTransitions, validateTransition } from "@/lib/state-machine";

describe("canTransition", () => {
  it("allows TODO → TODAY", () => expect(canTransition("TODO", "TODAY")).toBe(true));
  it("allows TODO → BLOCKED", () => expect(canTransition("TODO", "BLOCKED")).toBe(true));
  it("denies TODO → DONE", () => expect(canTransition("TODO", "DONE")).toBe(false));

  it("allows TODAY → DONE", () => expect(canTransition("TODAY", "DONE")).toBe(true));
  it("allows TODAY → TODO", () => expect(canTransition("TODAY", "TODO")).toBe(true));
  it("allows TODAY → BLOCKED", () => expect(canTransition("TODAY", "BLOCKED")).toBe(true));

  it("allows BLOCKED → TODO", () => expect(canTransition("BLOCKED", "TODO")).toBe(true));
  it("allows BLOCKED → TODAY", () => expect(canTransition("BLOCKED", "TODAY")).toBe(true));
  it("denies BLOCKED → DONE", () => expect(canTransition("BLOCKED", "DONE")).toBe(false));

  it("denies DONE → anything", () => {
    expect(canTransition("DONE", "TODO")).toBe(false);
    expect(canTransition("DONE", "TODAY")).toBe(false);
    expect(canTransition("DONE", "BLOCKED")).toBe(false);
  });
});

describe("getAvailableTransitions", () => {
  it("returns correct transitions for TODO", () => {
    expect(getAvailableTransitions("TODO")).toEqual(["TODAY", "BLOCKED"]);
  });
  it("returns empty for DONE", () => {
    expect(getAvailableTransitions("DONE")).toEqual([]);
  });
});

describe("validateTransition", () => {
  it("returns null for valid transitions", () => {
    expect(validateTransition("TODO", "TODAY")).toBeNull();
    expect(validateTransition("TODAY", "DONE")).toBeNull();
  });

  it("returns error for invalid transitions", () => {
    expect(validateTransition("DONE", "TODO")).toBe("Cannot transition from DONE to TODO");
  });

  it("requires note when moving from BLOCKED", () => {
    expect(validateTransition("BLOCKED", "TODO")).toBe("Moving from BLOCKED requires a note");
    expect(validateTransition("BLOCKED", "TODO", "")).toBe("Moving from BLOCKED requires a note");
    expect(validateTransition("BLOCKED", "TODO", "  ")).toBe("Moving from BLOCKED requires a note");
    expect(validateTransition("BLOCKED", "TODO", "Fixed")).toBeNull();
    expect(validateTransition("BLOCKED", "TODAY", "Resolved")).toBeNull();
  });
});
