export interface ITracksPluginSettings {
  // Endpoint settings
  tracksUrl: string;
  tracksUsername: string;
  tracksToken: string;

  // Development/Debug settings
  debug: {
    enableConsoleLogging: boolean;
  },

  // Methods
  getBasicToken(): string;
}

export const DEFAULT_SETTINGS: ITracksPluginSettings = {
  // Endpoint settings
  tracksUrl: "",
  tracksUsername: "",
  tracksToken: "",

  // Development/Debug settings
  debug: {
    enableConsoleLogging: false
  },

  // Methods
  getBasicToken(): string {
    const basic = `${this.tracksUsername}:${this.tracksToken}`;
    return btoa(basic)
  }
}
