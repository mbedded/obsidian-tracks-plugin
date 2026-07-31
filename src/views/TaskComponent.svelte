<script lang="ts">
  import { onMount } from "svelte";
  import { setIcon } from "obsidian";
  import { TaskItem } from "../adapters/TaskClasses";
  import { t } from "../localizer/Localizer";
  import type { IMessenger } from "../messenger/IMessenger";

  interface Props {
    // The entry to display and interact with.
    task: TaskItem;
    messenger: IMessenger;
    // Function (callback to parent) to mark an entry as done.
    markTaskAsDone: (x: TaskItem) => Promise<void>
    // Function (callback to parent) to delete entry.
    deleteTask: (x: TaskItem) => Promise<void>
  }

  let {
    task,
    messenger,
    markTaskAsDone,
    deleteTask
  }: Props = $props();

  let isDoneRunning = $state(false);
  let isDeleteRunning = $state(false);
  let isExpanded = $state(false);
  let descriptionIon: HTMLSpanElement;

  onMount(() => {
    setIcon(descriptionIon, "message-square-text");
  });

  async function onClickDone() {
    isDoneRunning = true;
    await markTaskAsDone(task);
    isDoneRunning = false;
  }

  async function onClickDelete() {
    isDeleteRunning = true;
    await deleteTask(task);
    isDeleteRunning = false;
  }

  async function onDoubleClickDescription() {
    messenger.send("update_task", task)
  }

  function onClickDescription(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }

    isExpanded = !isExpanded;
  }
</script>

<style>
  .container {
    margin-bottom: 5px;
    position: relative;

    &:hover {
      background-color: var(--color-base-30);

      .btn-delete {
        opacity: 1;
      }
    }
  }

  .task-row {
    display: flex;
    align-items: center;
    position: relative;
  }

  .btn-done {
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);

    &:hover {
      background-color: var(--interactive-accent-hover);
    }
  }

  .btn-delete {
    background-color: var(--background-modifier-error);
    color: var(--text-on-accent);
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;

    &:hover {
      background-color: var(--background-modifier-error-hover);
    }
  }

  .description {
    flex: 1;
    margin-left: 5px;
    margin-right: 10px;
  }

  .task-description {
    margin-top: 5px;
    margin-left: 30px;
    color: var(--text-muted);
    white-space: pre-wrap;
  }

  .description-icon {
    display: inline-flex;
    margin-left: 4px;
    vertical-align: center;
  }

  .spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid var(--text-on-accent);
    border-top: 2px transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

<div class="container">
  <div class="task-row">
    <!-- Button to mark task as "done" -->
    <button type="button" class="btn-done" onclick={onClickDone}>
      {#if !isDoneRunning}
        ✓
      {:else}
        <div class="spinner"></div>
      {/if}
    </button>

    <!-- Span/textbox to show or edit the description -->
    <span role="button"
          tabindex="0" class="description"
          ondblclick={onDoubleClickDescription}>
      {task.title}
      <button class="description-icon"
              bind:this={descriptionIon}
              style:display={!!task.description ? null : "none"}
              onclick={onClickDescription}
              tabindex="0"
              aria-label={isExpanded ? t("view.aria-lbl-collapse-description") : t("view.aria-lbl-expand-description")}
              aria-expanded={isExpanded}></button>
    </span>

    <!-- Delete button right side -->
    <button type="button" class="btn-delete" onclick={onClickDelete}>
      {#if !isDeleteRunning}
        {t("view.btn-delete-text")}
      {:else}
        <div class="spinner"></div>
      {/if}
    </button>
  </div>

  {#if isExpanded && task.description}
    <div class="task-description">{task.description}</div>
  {/if}
</div>
