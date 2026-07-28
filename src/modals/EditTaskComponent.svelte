<!--
  Note: This component is based on CreateTaskComponent and was adapted to handle the "edit" use case.
  Keeping "create" and "edit" as separate components avoids the complexity of managing
  two distinct states (new vs. edit) within a single component.
  Trade-off: Since the components are based on the same "Task" any change to the model
  or its features may require updates in multiple places. Keep them in sync when modifying.
-->
<script lang="ts">
  import { onMount, tick } from "svelte";
  import { type ContextItem, TaskItem } from "../adapters/TaskClasses";
  import { t } from "../localizer/Localizer";
  import { Helpers } from "../utils/Helpers";

  interface Props {
    contexts: ContextItem[];
    task: TaskItem;
    onSubmit: (updatedTask: TaskItem) => Promise<void>;
  }

  let {
    contexts,
    task,
    onSubmit
  }: Props = $props();

  let titleInput: HTMLInputElement;
  // svelte-ignore state_referenced_locally
  // This is intentional. The initial state should be displayed. The user drives subsequent updates.
  let editedTask = $state({...task});

  function handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  }

  onMount(async () => {
    await tick();
    titleInput.select();
    // titleInput.focus();
  });

  function handleSubmit() {
    editedTask.title = editedTask.title.trim();
    if (editedTask.title.length === 0) {
      return;
    }

    if (!!editedTask.description) {
      editedTask.description = editedTask.description.trim();
    } else {
      editedTask.description = "";
    }

    onSubmit(editedTask);
  }
</script>

<div class="modal-content task-dialog">
  <h2>{t("view.head-edit-task")}</h2>

  <!-- Context dropdown -->
  <div class="setting-item setting-item-custom">
    <div class="setting-item-info">
      <label class="setting-item-name" for="context">{t("view.lbl-context")}</label>
    </div>

    <div class="setting-item-control">
      <select id="context" bind:value={editedTask.contextId} class="dropdown">
        {#each contexts as context}
          <option value={context.id}>{context.name}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Title textbox -->
  <div class="setting-item setting-item-custom">
    <div class="setting-item-info">
      <label class="setting-item-name" for="title">{t("view.lbl-title")}</label>
    </div>

    <div class="setting-item-control">
      <input id="title" type="text" placeholder="{t("view.plh-title")}"
             bind:this={titleInput}
             bind:value={editedTask.title}
             onkeydown="{handleKeyDown}" />
    </div>
  </div>

  <!-- Description textarea -->
  <div class="setting-item setting-item-custom">
    <div class="setting-item-info">
      <label class="setting-item-name" for="description">{t("view.lbl-description")}</label>
      <label class="setting-item-name" for="description">{t("view.lbl-optional")}</label>
    </div>

    <div class="setting-item-control">
      <textarea id="description" rows="5" placeholder="{t("view.plh-description")}"
                bind:value={editedTask.description}
                onkeydown="{handleKeyDown}"></textarea>
    </div>
  </div>

  <div class="setting-item setting-item-custom task-dialog-actions">
    <div class="setting-item-info"></div>

    <div class="setting-item-control">
      <button type="button" class="btn-submit"
              disabled={Helpers.isTitleEmpty(editedTask?.title)}
              onclick="{handleSubmit}">{t("view.btn-save-changes")}
      </button>
    </div>
  </div>
</div>

<style>
  .task-dialog {
    width: 100%;
  }

  .task-dialog textarea {
    resize: vertical;
  }

  .task-dialog-actions :global(.setting-item-control) {
    justify-content: flex-end;
  }

  .btn-submit {
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);

    &:hover {
      background-color: var(--interactive-accent-hover);
    }
  }

  /* Overrides to adjust default style of Obsidian.
     I'm using my own scoped classes and "important" to avoid
     complex CSS-Selectors/Syntax like :global(..) */
  .setting-item-custom {
    border-top: none !important;
    align-items: flex-start !important;
  }

  .task-dialog input,
  .task-dialog textarea {
    width: 400px !important;
  }
</style>
