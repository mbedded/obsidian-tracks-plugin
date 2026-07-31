import { type IMessenger, type SettingsChangedEventArgs, SettingsType } from "../messenger/IMessenger";

/**
 * Represents a logging interface that provides methods for logging messages
 * with varying levels of severity.
 */
export interface ILogger {
  info: (message: string, ...optionalParams: unknown[]) => void;
  warn: (message: string, ...optionalParams: unknown[]) => void;
  error: (message: string, ...optionalParams: unknown[]) => void;
}

/**
 * A logger implementation that provides methods for logging informational, warning, and error messages.
 * The logger behavior can be dynamically updated based on application settings.
 * It uses function pointers to optimize performance by avoiding condition checks during logging.
 */
export class Logger implements ILogger {
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

  public info: (message: string, ...optionalParams: unknown[]) => void = Logger.defaultInfo;
  public warn: (message: string, ...optionalParams: unknown[]) => void = Logger.defaultWarn;
  public error: (message: string, ...optionalParams: unknown[]) => void = Logger.defaultError;

  private messenger: IMessenger;

  public initialize(messenger: IMessenger): void{
    if (this.messenger != null){
      // Ensure this method is called only once.
      return;
    }

    this.messenger = messenger;
    this.messenger.on("settings_changed", this.handleSettingsChanged.bind(this))
  }

  private handleSettingsChanged(args: SettingsChangedEventArgs) {
    if (args.type != SettingsType.Debugging) {
      return;
    }

    this.setLoggers(args.settings.debug.enableConsoleLogging);
  }

  public setLoggers(enableConsoleLogging: boolean) {
    // I'm using function pointers to improve performance instead of if-else every call.
    if (enableConsoleLogging) {
      this.info = Logger.defaultInfo;
      this.warn = Logger.defaultWarn;
    } else {
      this.info = Logger.doNothing;
      this.warn = Logger.doNothing;
    }

    // Always enable error logging
    this.error = Logger.defaultError;
  }

}
