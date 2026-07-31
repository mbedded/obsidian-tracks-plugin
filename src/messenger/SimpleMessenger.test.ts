import { expect, test } from "vitest";
import { SimpleMessenger } from "./SimpleMessenger";
import { NullLogger } from "../utils/TestUtils";

const getInstance = () => new SimpleMessenger(NullLogger.instance);

test("Create instance", () => {
  const sut = getInstance();

  expect(sut).toBeTruthy();
});

test("Create listeners, ensure events are raised", () => {
  const sut = getInstance();

  let reloadRaised = false;
  const loginRaised = false;

  sut.on("reload", () => {
    reloadRaised = true;
  });

  sut.send("reload", undefined);

  expect(reloadRaised).toBeTruthy();
  expect(loginRaised).toBeFalsy();
})

