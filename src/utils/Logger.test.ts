import { describe, expect, test, vi } from "vitest";
import { Logger } from "./Logger";
import { SettingsType } from "../messenger/IMessenger";
import { SimpleMessenger } from "../messenger/SimpleMessenger";
import { DEFAULT_SETTINGS } from "../settings/Settings";

describe("Via settings", () => {

  test("Enable logging, expect all log levels are logged", () => {
    Logger.setLoggers(true);

    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {
    });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
    });

    Logger.info("info message", 123);
    expect(infoSpy).toHaveBeenCalledWith("info message", 123);

    Logger.warn("warn message", 123);
    expect(warnSpy).toHaveBeenCalledWith("warn message", 123);

    Logger.error("error message", 123);
    expect(errorSpy).toHaveBeenCalledWith("error message", 123);

    infoSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test("Disable logging, expect only error is logged", () => {
    Logger.setLoggers(false);

    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {
    });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
    });

    Logger.info("info message", 123);
    expect(infoSpy).not.toHaveBeenCalled();

    Logger.warn("warn message", 123);
    expect(warnSpy).not.toHaveBeenCalled();

    Logger.error("error message", 123);
    expect(errorSpy).toHaveBeenCalledWith("error message", 123);

    infoSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });
});

describe("Via settingsChanged event", () => {

  test("Invalid event type, setLoggers is not called", () => {
    const spy = vi.spyOn(Logger, "setLoggers")
      .mockImplementation((arg) => {
      });

    SimpleMessenger.getInstance().send("settings_changed", {type: SettingsType.Endpoint, settings: DEFAULT_SETTINGS});

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test("Valid event type, setLoggers is called", () => {
    const spy = vi.spyOn(Logger, "setLoggers")
      .mockImplementation((arg) => {
      });

    SimpleMessenger.getInstance().send("settings_changed", {type: SettingsType.Debugging, settings: DEFAULT_SETTINGS});

    expect(spy).toHaveBeenCalledWith(DEFAULT_SETTINGS.debug.enableConsoleLogging);
    spy.mockRestore();
  });

  // test.for([
  //   {type: SettingsType.Endpoint, arg: false, called: false},
  //   {type: SettingsType.Debugging, arg: false, called: true},
  //   {type: SettingsType.Debugging, arg: true, called: true}
  // ])("raise $type, enabled: $arg expect $called", ({type, arg, called}) => {
  //   const spy = vi.spyOn(Logger, "setLoggers")
  //     .mockImplementation((arg) => {
  //     });
  //
  //   const settings = Helpers.clone(DEFAULT_SETTINGS);
  //   settings.debug.enableConsoleLogging = arg;
  //
  //   SimpleMessenger.getInstance().send("settings_changed", {type: type, settings: settings});
  //
  //   if (called) {
  //     expect(spy).toHaveBeenCalledWith(arg);
  //   } else {
  //     expect(spy).not.toHaveBeenCalled();
  //   }
  //
  //   spy.mockRestore();
  // })

})
