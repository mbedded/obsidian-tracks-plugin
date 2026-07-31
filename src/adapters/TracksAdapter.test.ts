import { test, expect, describe } from "vitest";
import { TracksAdapter } from "./TracksAdapter";
import type { RequestUrlParam, RequestUrlResponsePromise } from "obsidian";
import { emptyRequest, realFetchRequest } from "./AdapterHelper.test";
import { DoNothingMessenger, NullLogger } from "../utils/TestUtils";

const TOKEN_LOCALHOST = btoa("mbedded:79907a25379561f41dbbfb87f388e3519ce9daf8"); // "bWJlZGRlZDo0MWRlOTZlYzkwYzZmMjhiY2Q1NWMyZjNhMDcwOTg1NjYxYzQ4ZjBm";
const EMPTY_TOKEN = "";
const BASE_ADDRESS = "http://localhost:8000";

function getInstance(token: string, doRequest: (request: RequestUrlParam | string) => RequestUrlResponsePromise) {
  return new TracksAdapter(BASE_ADDRESS, token, doRequest, DoNothingMessenger.instance, NullLogger.instance);
}

describe("With empty token", () => {
  test("Instance can be created", () => {
    const sut = getInstance(EMPTY_TOKEN, emptyRequest)

    expect(sut).toBeTruthy();
  });

  test("Ping should return unauthenticated", {tags: ["integration"]}, async () => {
    const sut = getInstance(EMPTY_TOKEN, realFetchRequest);

    const result = await sut.ping();

    expect(result.isReachable).toBeTruthy();
    expect(result.isAuthenticated).toBeFalsy();
    expect(result.isOk()).toBeFalsy();
  })
})

describe("With valid token", () => {
  test("Instance can be created", () => {
    const sut = getInstance(TOKEN_LOCALHOST, realFetchRequest);

    expect(sut).toBeTruthy();
  })

  test("Ping should return authenticated", {tags: ["integration"]}, async () => {
    const sut = getInstance(TOKEN_LOCALHOST, realFetchRequest);

    const result = await sut.ping();

    expect(result.isReachable).toBeTruthy();
    expect(result.isAuthenticated).toBeTruthy();
    expect(result.isOk()).toBeTruthy();
  })

  test("Get contexts should return 3 items", {tags: ["integration"]}, async () => {
    const sut = getInstance(TOKEN_LOCALHOST, realFetchRequest);

    const result = await sut.getActiveContexts();

    expect(result).toHaveLength(3);
  });

  test("Get tasks should return 2 items", {tags: ["integration"]}, async () => {
    const sut = getInstance(TOKEN_LOCALHOST, realFetchRequest);

    const result = await sut.getActiveTasks(1);

    expect(result).toHaveLength(3);
  });
})

