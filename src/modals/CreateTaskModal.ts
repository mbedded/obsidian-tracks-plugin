import { type App, Modal } from "obsidian";
import { mount, unmount } from "svelte";
import CreateTaskComponent from "./CreateTaskComponent.svelte";
import type { ITaskAdapter } from "../adapters/ITaskAdapter";
import { t } from "../localizer/Localizer";
import type { IMessenger } from "../messenger/IMessenger";

export class CreateTaskModal extends Modal {
  private readonly adapter: ITaskAdapter;
  private readonly messenger: IMessenger;
  private view: ReturnType<typeof CreateTaskComponent> | null = null;

  constructor(app: App, adapter: ITaskAdapter, messenger: IMessenger) {
    super(app);
    this.adapter = adapter;
    this.messenger = messenger;
  }

  async onOpen() {
    // todo: add something like a cache to avoid multiple requests every time a task is created
    // add error handling. Ensure there are contexts available.
    // Maybe the contexts should be passed from outside *before* opening the modal.
    const contexts = await this.adapter.getActiveContexts();

    if (contexts.length === 0) {
      this.messenger.send("show_notice_error", t("notice.no-contexts-available"));
      this.close();
      return;
    }

    this.view = mount(CreateTaskComponent, {
      target: this.contentEl,
      props: {
        contexts: contexts,
        onSubmit: this.onSubmit.bind(this)
      }
    });
  }

  async onClose() {
    if (this.view) {
      await unmount(this.view);
    }
  }

  private async onSubmit(title: string, description: string, contextId: number) {
    if (!title) {
      this.messenger.send("show_notice_error", t("notice.title-is-required"));
      return;
    }

    const task = await this.adapter.createTask(contextId, title, description);
    this.messenger.send("task_created", {
      taskId: task.id,
      contextId: contextId,
      title: title,
      description: description
    });
    this.close();
  }
}
