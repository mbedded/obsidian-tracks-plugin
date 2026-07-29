import { type App, Notice, Plugin, type PluginManifest, requestUrl, WorkspaceLeaf } from "obsidian";
import { DEFAULT_SETTINGS, type ITracksPluginSettings } from "./settings/Settings";
import { MainViewModel, VIEW_TYPE_MAIN } from "./views/MainViewModel";
import { initializeLocalization } from "./main.localization";
import { TracksAdapter } from "./adapters/TracksAdapter";
import { SettingTab } from "./settings/SettingTab";
import { t } from "./localizer/Localizer";
import { SimpleMessenger } from "./messenger/SimpleMessenger";
import { CreateTaskModal } from "./modals/CreateTaskModal";
import type { ITaskAdapter } from "./adapters/ITaskAdapter";
import { Helpers } from "./utils/Helpers";
import { EditTaskModal } from "./modals/EditTaskModal";

export default class TracksPlugin extends Plugin {
  private static readonly DEFAULT_NOTICE_TIME: number = 3000;
  private static readonly ERROR_NOTICE_TIME: number = 15000;

  private _settings: ITracksPluginSettings;
  private messenger = SimpleMessenger.getInstance();
  private adapter: ITaskAdapter;

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

    this.messenger.on("show_notice_error", message => {
        message = `${t("notice.prefix-error")}: ${message}`;
        this.showNotice(message, TracksPlugin.ERROR_NOTICE_TIME);
      }
    )

    this.messenger.on("update_task", task => {
        const clone = Helpers.clone(task);
        const adapter = this.getAdapter();
        new EditTaskModal(this.app, adapter, clone).open();
      }
    )
  }

  public get settings() {
    return this._settings;
  }

  async onload() {
    await this.loadSettings();

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SettingTab(this.app, this));

    // Sidebar
    this.addRibbonIcon("square-check-big", t("commands.open-dashboard"), async () => {
      await this.activateView();
    });

    // Commands
    this.registerCommands();

    // Views
    this.registerView(
      VIEW_TYPE_MAIN,
      (leaf) => {
        const adapter = this.getAdapter();
        return new MainViewModel(leaf, adapter);
      }
    );
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

    this.addCommand({
      id: "create-task",
      name: t("commands.create-task"),
      callback: () => {
        const adapter = this.getAdapter();
        new CreateTaskModal(this.app, adapter).open();
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

  private getAdapter(): ITaskAdapter {
    return this.adapter ??= new TracksAdapter(this.settings.tracksUrl, this.settings.getBasicToken(), requestUrl);
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
