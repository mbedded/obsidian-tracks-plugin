export interface TracksPluginSettings {
	tracksUrl: string;
	tracksUsername: string;
	tracksToken: string;
}

export const DEFAULT_SETTINGS: TracksPluginSettings = {
	tracksUrl: "",
	tracksUsername: "",
	tracksToken: "",
}
