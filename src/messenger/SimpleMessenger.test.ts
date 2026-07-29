import { expect, test } from "vitest";
import { SimpleMessenger } from "./SimpleMessenger";
import type { EventMap, IMessenger } from "./IMessenger";

export class DoNothingMessenger implements IMessenger {
  dispose(): void {
  }

  on<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void {
  }

  send<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
  }

  unregister<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void {
  }
}

test("Create instance", () => {
  const sut = SimpleMessenger.getInstance();

  expect(sut).toBeTruthy();
});

test("Create listeners, ensure events are raised", () => {
  const sut = SimpleMessenger.getInstance();

  let reloadRaised = false;
  const loginRaised = false;

  sut.on("reload", () => {
    reloadRaised = true;
  });

  sut.send("reload", undefined);

  expect(reloadRaised).toBeTruthy();
  expect(loginRaised).toBeFalsy();
})

