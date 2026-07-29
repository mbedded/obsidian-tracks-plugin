import { SimpleMessenger } from "../messenger/SimpleMessenger";
import { type IMessenger, type SettingsChangedEventArgs, SettingsType } from "../messenger/IMessenger";

export class Logger {
  private static messenger: IMessenger | null;

  private static readonly doNothing = (message: string, ...optionalParams: unknown[]): void => {
  }

  private static readonly infoDefault = (message: string, ...optionalParams: unknown[]): void => {
    console.info(message, ...optionalParams);
  }

  private static readonly warnDefault = (message: string, ...optionalParams: unknown[]): void => {
    console.warn(message, ...optionalParams);
  }

  private static readonly errorDefault = (message: string, ...optionalParams: unknown[]): void => {
    console.error(message, ...optionalParams);
  }

  private constructor() {
    // Prevent instantiation
  }

  static {
    this.messenger = SimpleMessenger.getInstance();
    this.messenger.on("settings_changed", this.handleSettingsChanged)
  }

  private static handleSettingsChanged(args: SettingsChangedEventArgs) {
    if (args.type != SettingsType.Debugging) {
      return;
    }

    const settings = args.settings.debug;

    // I'm using function pointers to improve performance instead of if-else every call.
    if (settings.enableConsoleLogging) {
      Logger.info = Logger.infoDefault;
      Logger.warn = Logger.warnDefault;
    } else {
      Logger.info = Logger.doNothing;
      Logger.warn = Logger.doNothing;
    }

    // Always enable error logging
    Logger.error = Logger.errorDefault;
  }

  public static info: (message: string, ...optionalParams: unknown[]) => void = Logger.infoDefault;
  public static warn: (message: string, ...optionalParams: unknown[]) => void = Logger.warnDefault;
  public static error: (message: string, ...optionalParams: unknown[]) => void = Logger.errorDefault;
}
