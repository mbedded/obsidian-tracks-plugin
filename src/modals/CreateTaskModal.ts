import { type App, Modal } from "obsidian";
import CreateTaskComponent from "./CreateTaskComponent.svelte";
import { mount, unmount } from "svelte";
import type { ITaskAdapter } from "../adapters/ITaskAdapter";

export class CreateTaskModal extends Modal {
  private view: ReturnType<typeof CreateTaskComponent> | null = null;
  private adapter: ITaskAdapter;

  constructor(app: App, adapter: ITaskAdapter) {
    super(app);
    this.adapter = adapter;
  }

  async onOpen() {
    // todo: add something like a cache to avoid multiple requests every time a task is created
    // add error handling. Ensure there are contexts available
    const contexts = await this.adapter.getActiveContexts()
    this.view = mount(CreateTaskComponent, {
      target: this.contentEl,
      props: {
        contexts: contexts,
        onSubmit: this.onSubmit,
      }
    });
  }

  async onClose() {
    if (this.view) {
      await unmount(this.view);
    }
  }

  private async onSubmit(title: string, description: string, contextId: number) {
    // let task = await this.adapter.createTask(contextId, title);
    // todo: save task using adapter

  }
}
