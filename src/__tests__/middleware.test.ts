import { describe, it, expect } from "vitest";
import { config } from "@/proxy";

describe("middleware config", () => {
  it("exports a matcher array", () => {
    expect(config.matcher).toBeDefined();
    expect(Array.isArray(config.matcher)).toBe(true);
    expect(config.matcher.length).toBeGreaterThan(0);
  });

  it("has a pattern that excludes static files", () => {
    const staticPattern = config.matcher[0];
    expect(staticPattern).toContain("_next");
    expect(staticPattern).toContain("ico");
    expect(staticPattern).toContain("png");
    expect(staticPattern).toContain("css");
  });

  it("has a pattern for api and trpc routes", () => {
    const apiPattern = config.matcher[1];
    expect(apiPattern).toContain("api");
    expect(apiPattern).toContain("trpc");
  });
});
