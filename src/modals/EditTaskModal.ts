import { type App, Modal } from "obsidian";
import { mount, unmount } from "svelte";
import EditTaskComponent from "./EditTaskComponent.svelte";
import type { ITaskAdapter } from "../adapters/ITaskAdapter";
import type { TaskItem } from "../adapters/TaskClasses";
import { SimpleMessenger } from "../messenger/SimpleMessenger";
import type { TaskUpdatedEventArgs } from "../messenger/IMessenger";

export class EditTaskModal extends Modal {
  private view: ReturnType<typeof EditTaskComponent> | null = null;
  private adapter: ITaskAdapter;
  private task: TaskItem;
  private messenger = SimpleMessenger.getInstance();

  constructor(app: App, adapter: ITaskAdapter, task: TaskItem) {
    super(app);
    this.adapter = adapter;
    this.task = task;
  }

  async onOpen() {
    // todo: add something like a cache to avoid multiple requests every time a task is updated
    // add error handling. Ensure there are contexts available.
    // Maybe the contexts should be passed from outside *before* opening the modal.
    const contexts = await this.adapter.getActiveContexts();

    this.view = mount(EditTaskComponent, {
      target: this.contentEl,
      props: {
        contexts: contexts,
        task: this.task,
        onSubmit: this.onSubmit.bind(this)
      }
    });
  }

  async onClose() {
    if (this.view) {
      await unmount(this.view);
    }
  }

  private async onSubmit(editedTask: TaskItem) {
    if (!editedTask.title) {
      this.messenger.send("show_notice_error", "Title is required.");
      return;
    }

    const task = await this.adapter.updateTask(editedTask.id, editedTask.contextId, editedTask.title, editedTask.description);

    // const task = await this.adapter.createTask(contextId, title, description);
    // todo: update views. check contextId to add/remove task to the matching context
    const args: TaskUpdatedEventArgs = {taskId: task.id, contextId: task.contextId, title: task.title, description: task.description};
    this.messenger.send("task_updated", args);
    this.close();
  }
}
