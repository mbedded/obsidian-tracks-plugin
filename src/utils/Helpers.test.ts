import { describe, expect, test } from "vitest";
import { Helpers } from "./Helpers";

describe("Clone", () => {
  test("creates a copy of an object", () => {
    const original = {
      title: "Test",
      count: 3
    };

    const cloned = Helpers.clone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });

  test("does not keep nested object references because it is a deep copy", () => {
    const nested = {value: "nested"};
    const original = {nested};
    const cloned = Helpers.clone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.nested).not.toBe(nested);
  });
});

describe("isTitleEmpty", () => {
  test("returns true for an empty string", () => {
    expect(Helpers.isTitleEmpty("")).toBe(true);
  });

  test("returns true for a whitespace-only string", () => {
    expect(Helpers.isTitleEmpty("   ")).toBe(true);
    expect(Helpers.isTitleEmpty("\t\n")).toBe(true);
  });

  test("returns true for null or undefined values", () => {
    // @ts-ignore
    expect(Helpers.isTitleEmpty(null)).toBe(true);
    // @ts-ignore
    expect(Helpers.isTitleEmpty(undefined)).toBe(true);
  });

  test("returns false for a non-empty title", () => {
    expect(Helpers.isTitleEmpty("My Title")).toBe(false);
  });

  test("returns false for a title with surrounding whitespace", () => {
    expect(Helpers.isTitleEmpty("  My Title  ")).toBe(false);
  });
});
