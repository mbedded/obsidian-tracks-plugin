import {Notice, Plugin, WorkspaceLeaf} from 'obsidian';
import {DEFAULT_SETTINGS, type TracksPluginSettings} from "./settings/Settings";
import {TracksSettingTab} from "./settings/TracksSettingTab";
import {MainViewModel, VIEW_TYPE_EXAMPLE} from "./views/MainViewModel";


export default class TracksPlugin extends Plugin {
	settings: TracksPluginSettings;

	async onload() {
		this.registerView(
			VIEW_TYPE_EXAMPLE,
			(leaf) => new MainViewModel(leaf)
		);

		this.addRibbonIcon('dice', 'Activate views', () => {
			this.activateView();
		});

		await this.loadSettings();

		// todo: add command to open views
		// // This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TracksSettingTab(this.app, this));

		// todo: background checks?
		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async activateView() {
		const {workspace} = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);

		if (leaves.length > 0) {
			// A leaf with our views already exists, use that
			leaf = leaves[0];
		} else {
			// Our views could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			// leaf = workspace.getRightLeaf(false);
			// leaf = workspace.getLeaf(false);
			leaf = workspace.getLeaf("tab");

			await leaf!.setViewState({type: VIEW_TYPE_EXAMPLE, active: true});
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		await workspace.revealLeaf(leaf!);
	}
}


