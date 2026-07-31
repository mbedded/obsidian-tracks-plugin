import { describe, expect, test, vi } from "vitest";
import { Logger } from "./Logger";
import { SettingsType } from "../messenger/IMessenger";
import { SimpleMessenger } from "../messenger/SimpleMessenger";
import { DEFAULT_SETTINGS } from "../settings/Settings";
import { NullLogger } from "./TestUtils";

const getInstance = () => new Logger();
const getMessenger = () => new SimpleMessenger(NullLogger.instance);

describe("Via settings", () => {

  test("Enable logging, expect all log levels are logged", () => {
    const sut = getInstance();
    sut.setLoggers(true);

    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {
    });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
    });

    sut.info("info message", 123);
    expect(infoSpy).toHaveBeenCalledWith("info message", 123);

    sut.warn("warn message", 123);
    expect(warnSpy).toHaveBeenCalledWith("warn message", 123);

    sut.error("error message", 123);
    expect(errorSpy).toHaveBeenCalledWith("error message", 123);

    infoSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test("Disable logging, expect only error is logged", () => {
    const sut = getInstance();
    sut.setLoggers(false);

    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {
    });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
    });

    sut.info("info message", 123);
    expect(infoSpy).not.toHaveBeenCalled();

    sut.warn("warn message", 123);
    expect(warnSpy).not.toHaveBeenCalled();

    sut.error("error message", 123);
    expect(errorSpy).toHaveBeenCalledWith("error message", 123);

    infoSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });
});

describe("Via settingsChanged event", () => {

  test("Invalid event type, setLoggers is not called", () => {
    const sut = getInstance();
    const spy = vi.spyOn(sut, "setLoggers")
      .mockImplementation((x) => {
      });

    const messenger = getMessenger();
    sut.initialize(messenger);
    messenger.send("settings_changed", {type: SettingsType.Endpoint, settings: DEFAULT_SETTINGS});

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test("Valid event type, setLoggers is called", () => {
    const sut = getInstance();
    const spy = vi.spyOn(sut, "setLoggers")
      .mockImplementation((x) => {
      });

    const messenger = getMessenger();
    sut.initialize(messenger);
    messenger.send("settings_changed", {type: SettingsType.Debugging, settings: DEFAULT_SETTINGS});

    expect(spy).toHaveBeenCalledWith(DEFAULT_SETTINGS.debug.enableConsoleLogging);
    spy.mockRestore();
  });

})
