import { Modal } from "obsidian";
import CreateTaskComponent from "./CreateTaskComponent.svelte";
import { mount, unmount } from "svelte";

export class CreateTaskModal extends Modal {
  view: ReturnType<typeof CreateTaskComponent> | null = null;

  onOpen() {
    this.view = mount(CreateTaskComponent, {
      target: this.contentEl,
      props: {}
    });
  }

  async onClose() {
    if (this.view) {
      await unmount(this.view);
    }
  }
}
