import { expect, test } from "@jest/globals";
import { SimpleMessenger } from "./SimpleMessenger";

test("Create instance", () => {
  const sut = new SimpleMessenger();

  expect(sut).toBeTruthy();
});

test("Create listeners, ensure events are raised", () => {
  const sut = new SimpleMessenger();

  let reloadRaised = false;
  const loginRaised = false;

  sut.on("reload", () => {
    reloadRaised = true;
  });

  sut.send("reload", undefined);

  expect(reloadRaised).toBeTruthy();
  expect(loginRaised).toBeFalsy();
})

