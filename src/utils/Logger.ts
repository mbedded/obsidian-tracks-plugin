import { SimpleMessenger } from "../messenger/SimpleMessenger";
import { type IMessenger, type SettingsChangedEventArgs, SettingsType } from "../messenger/IMessenger";

export class Logger {
  private static messenger: IMessenger | null;

  private static readonly doNothing = (message: string, ...optionalParams: unknown[]): void => {
  }

  private static readonly defaultInfo = (message: string, ...optionalParams: unknown[]): void => {
    console.info(message, ...optionalParams);
  }

  private static readonly defaultWarn = (message: string, ...optionalParams: unknown[]): void => {
    console.warn(message, ...optionalParams);
  }

  private static readonly defaultError = (message: string, ...optionalParams: unknown[]): void => {
    console.error(message, ...optionalParams);
  }

  public static info: (message: string, ...optionalParams: unknown[]) => void = Logger.defaultInfo;
  public static warn: (message: string, ...optionalParams: unknown[]) => void = Logger.defaultWarn;
  public static error: (message: string, ...optionalParams: unknown[]) => void = Logger.defaultError;

  private constructor() {
    // Prevent instantiation
  }

  static {
    this.messenger = SimpleMessenger.getInstance();
    this.messenger.on("settings_changed", this.handleSettingsChanged.bind(this))
  }

  private static handleSettingsChanged(args: SettingsChangedEventArgs) {
    if (args.type != SettingsType.Debugging) {
      return;
    }

    this.setLoggers(args.settings.debug.enableConsoleLogging);
  }

  static setLoggers(enableConsoleLogging: boolean) {
    // I'm using function pointers to improve performance instead of if-else every call.
    if (enableConsoleLogging) {
      Logger.info = Logger.defaultInfo;
      Logger.warn = Logger.defaultWarn;
    } else {
      Logger.info = Logger.doNothing;
      Logger.warn = Logger.doNothing;
    }

    // Always enable error logging
    Logger.error = Logger.defaultError;
  }

}
