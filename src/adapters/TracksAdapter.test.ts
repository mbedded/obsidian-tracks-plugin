import { test, expect, describe } from "@jest/globals";
import { TracksAdapter } from "./TracksAdapter";
import type { RequestUrlParam, RequestUrlResponsePromise } from "obsidian";
import { emptyRequest, isCiBuild, realFetchRequest, testIf } from "./AdapterHelper.test";

const TOKEN_LOCALHOST = btoa("mbedded:79907a25379561f41dbbfb87f388e3519ce9daf8"); // "bWJlZGRlZDo0MWRlOTZlYzkwYzZmMjhiY2Q1NWMyZjNhMDcwOTg1NjYxYzQ4ZjBm";
const EMPTY_TOKEN = "";
const BASE_ADDRESS = "http://localhost:8000";

function getInstance(token: string, doRequest: (request: RequestUrlParam | string) => RequestUrlResponsePromise) {
  return new TracksAdapter(BASE_ADDRESS, token, doRequest);
}

describe("With empty token", () => {
  test("Instance can be created", () => {
    const sut = getInstance(EMPTY_TOKEN, emptyRequest)

    expect(sut).toBeTruthy();
  });

  testIf(!isCiBuild, "Ping should return unauthenticated", async () => {
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

  testIf(!isCiBuild, "Ping should return authenticated", async () => {
    const sut = getInstance(TOKEN_LOCALHOST, realFetchRequest);

    const result = await sut.ping();

    expect(result.isReachable).toBeTruthy();
    expect(result.isAuthenticated).toBeTruthy();
    expect(result.isOk()).toBeTruthy();
  })

  testIf(!isCiBuild, "Get contexts should return 3 items", async () => {
    const sut = getInstance(TOKEN_LOCALHOST, realFetchRequest);

    const result = await sut.getActiveContexts();

    expect(result).toHaveLength(3);
  });

  testIf(!isCiBuild, "Get tasks should return 2 items", async () => {
    const sut = getInstance(TOKEN_LOCALHOST, realFetchRequest);

    const result = await sut.getActiveTasks(1);

    expect(result).toHaveLength(2);
  });
})

