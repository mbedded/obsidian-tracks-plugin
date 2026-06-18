import { ItemView, WorkspaceLeaf } from "obsidian";
import { mount, unmount } from "svelte";
import MainViewComponent from "./MainViewComponent.svelte";
import type { ITaskAdapter } from "../adapters/ITaskAdapter";
import { t } from "../localizer/Localizer";

export const VIEW_TYPE_MAIN = "main-view";

/**
 * This class represents the main view and entry point of the plugin.
 * It shows the tasks and allows interacting with them.
 */
export class MainViewModel extends ItemView {
  private readonly taskAdapter: ITaskAdapter;
  private mainView: ReturnType<typeof MainViewComponent> | undefined;

  constructor(leaf: WorkspaceLeaf, taskAdapter: ITaskAdapter) {
    super(leaf);
    this.taskAdapter = taskAdapter;
  }

  getViewType() {
    return VIEW_TYPE_MAIN;
  }

  getDisplayText() {
    return t("view.title");
  }

  async onOpen() {
    // Attach the Svelte component to the ItemViews content element and provide the needed props.
    this.mainView = mount(MainViewComponent, {
      target: this.contentEl,
      props: {
        adapter: this.taskAdapter,
      }
    });
  }

  async onClose() {
    if (this.mainView) {
      await unmount(this.mainView);
    }
  }
}
