import { type App, Notice, Plugin, type PluginManifest, requestUrl, WorkspaceLeaf } from "obsidian";
import { DEFAULT_SETTINGS, type TracksPluginSettings } from "./settings/Settings";
import { MainViewModel, VIEW_TYPE_MAIN } from "./views/MainViewModel";
import { initializeLocalization } from "./main.localization";
import { TracksAdapter } from "./adapters/TracksAdapter";
import { SettingTab } from "./settings/SettingTab";
import { t } from "./localizer/Localizer";
import { SimpleMessenger } from "./messenger/SimpleMessenger";

export default class TracksPlugin extends Plugin {
  private static readonly DEFAULT_NOTICE_TIME: number = 3000;

  private _settings: TracksPluginSettings;
  private messenger = SimpleMessenger.getInstance();

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);

    initializeLocalization();
    this.registerEvents();
  }

  private registerEvents() {
    this.messenger.on("show_notice", message => {
        this.showNotice(message);
      }
    )
  }

  public get settings() {
    return this._settings;
  }

  async onload() {
    this.registerView(
      VIEW_TYPE_MAIN,
      (leaf) => {
        const adapter = new TracksAdapter(this.settings.tracksUrl, this.settings.getBasicToken(), requestUrl);
        return new MainViewModel(leaf, adapter);
      }
    );

    this.addRibbonIcon("square-check-big", t("commands.open-dashboard"), async () => {
      await this.activateView();
    });

    await this.loadSettings();

    this.registerCommands();

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SettingTab(this.app, this));
  }

  private registerCommands() {
    this.addCommand({
      id: "open-dashboard",
      name: t("commands.open-dashboard"),
      callback: async () => {
        await this.activateView();
      }
    });

    this.addCommand({
      id: "reload-tasks",
      name: t("commands.reload-tasks"),
      callback: () => {
        this.showNotice(t("notice.command-reload"))
        this.messenger.send("reload", undefined);
      }
    })
  }

  onunload() {
  }

  async loadSettings() {
    this._settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async activateView() {
    const {workspace} = this.app;

    let leaf: WorkspaceLeaf | null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_MAIN);

    if (leaves.length > 0) {
      // A leaf (tab) with our views exists already. We use this.
      leaf = leaves[0];
    } else {
      // Our views could not be found in the workspace, create a new tab.
      leaf = workspace.getLeaf("tab");
      await leaf.setViewState({type: VIEW_TYPE_MAIN, active: true});
    }

    // "Reveal" the leaf in case it is in a collapsed sidebar
    await workspace.revealLeaf(leaf);
  }

  private showNotice(message: string, duration: number = TracksPlugin.DEFAULT_NOTICE_TIME): void {
    new Notice(message, duration);
  }
}
