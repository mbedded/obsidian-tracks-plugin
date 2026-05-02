import { expect, test } from "@jest/globals";
import { SimpleMessenger } from "./SimpleMessenger";

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

