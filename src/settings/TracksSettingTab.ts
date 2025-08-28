import {App, PluginSettingTab, Setting} from "obsidian";
import TracksPlugin from "../main";

export class TracksSettingTab extends PluginSettingTab {
	plugin: TracksPlugin;

	constructor(app: App, plugin: TracksPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Tracks URL')
			.setDesc('Base URL of your instance of Tracks.')
			.addText(text => text
				.setPlaceholder('http://localhost:3000/')
				.setValue(this.plugin.settings.tracksUrl)
				.onChange(async (value) => {
					this.plugin.settings.tracksUrl = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Username')
			.setDesc('Your username to access Tracks.')
			.addText(text => text
				.setPlaceholder('example')
				.setValue(this.plugin.settings.tracksUsername)
				.onChange(async (value) => {
					this.plugin.settings.tracksUsername = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Token')
			.setDesc('Your token to access Tracks.')
			.addText(text => text
				.setPlaceholder('')
				.setValue(this.plugin.settings.tracksToken)
				.onChange(async (value) => {
					this.plugin.settings.tracksToken = value;
					await this.plugin.saveSettings();
				}));
	}
}
