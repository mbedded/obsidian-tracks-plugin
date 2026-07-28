import { beforeEach, describe, expect, test } from 'vitest'
import localizer from "./Localizer";

beforeEach(() => {
  localizer.reset();
})

test("get singleton instance expect both instances are the same", () => {
  const instance1 = localizer;
  const instance2 = localizer;

  expect(instance1).toBe(instance2);
});

test.each([["en", true], ["fr", false], ["es", false]])(
  "check '%s' existing, expected '%s'", (locale, expected) => {
    const sut = localizer;
    sut.add("de", {});
    sut.add("en", {});
    expect(sut.isLocale(locale)).toBe(expected);
  })

describe("pass values and verify resolve", () => {
  test("use and resolve EN", () => {
    const sut = localizer;
    sut.add("en", {key1: "value1"});

    const result = sut.translate("key1");
    expect(result).toBe("value1");
  })

  test("resolve same key with different languages", () => {
    const sut = localizer;
    sut.add("en", {key1: "en-value1"});
    sut.add("de", {key1: "de-value1"});

    let result = sut.translate("key1");
    expect(result).toBe("en-value1");

    sut.setLocale("de");
    result = sut.translate("key1");
    expect(result).toBe("de-value1");
  })

  test("give missing key, expect key returned", () => {
    const sut = localizer;
    sut.setLocale("asdasdsad");
    sut.add("de", {key1: "en-value1"});

    const result = sut.translate("missing-key");
    expect(result).toBe("missing-key");
  })
})

describe("interpolation", () => {
  test("ensure it's working", () => {
    const sut = localizer;
    sut.add("en", {key1: "hello {word1} {subject}!"});

    const result = sut.translate("key1", {word1: "123", subject: "you"});
    expect(result).toBe("hello 123 you!");
  })

  test("ensure it's working when argument is missing", () => {
    const sut = localizer;
    sut.add("en", {key1: "hello {word1} {subject}!"});

    const result = sut.translate("key1", {word1: "123"});
    expect(result).toBe("hello 123 {subject}!");
  })
})
