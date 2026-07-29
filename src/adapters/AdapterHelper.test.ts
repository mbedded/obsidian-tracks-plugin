/**
 * This is a general helper-class for testing the adapters.
 */
import type { RequestUrlParam, RequestUrlResponsePromise } from "obsidian";
import { test } from "vitest";

// Just added so Vitest doesn't throw an error.
test("ignore this file", () => {})

export function emptyRequest(_request: RequestUrlParam | string): RequestUrlResponsePromise {
  return {} as RequestUrlResponsePromise;
}

/**
 * This method was created to use "fetch()" in tests but use the type given by Obsidian.
 */
// @ts-ignore, because RequestUrlResponsePromise is already a Promise<T>
export async function realFetchRequest(request: RequestUrlParam | string): RequestUrlResponsePromise {
  const url = typeof request === "string" ? request : request.url;
  const resp = await fetch(url, {
    method: typeof request === "string" ? "GET" : request.method,
    headers: typeof request === "string" ? undefined : request.headers,
    body: typeof request === "string" ? undefined : request.body
  });

  // Read the body once and cache it to avoid body read multiple times exception.
  const arrayBuffer = await resp.arrayBuffer();
  const text = new TextDecoder().decode(arrayBuffer);
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // do nothing
  }

  const response = {
    status: resp.status,
    // @ts-ignore, because 'resp.headers' works despite the error message
    headers: Promise.resolve(Object.fromEntries(resp.headers)),
    arrayBuffer: arrayBuffer,
    json: json,
    text: text
  } as unknown as RequestUrlResponsePromise;

  // Throw exception for non-2xx status codes like "fetch" does.
  if (!resp.ok) {
    const error = new Error(`HTTP ${resp.status}: ${resp.statusText}`) as any;
    error.status = resp.status;
    error.response = response;
    throw error;
  }

  return response;
}
