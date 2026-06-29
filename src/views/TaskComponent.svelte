<script lang="ts">
  import { TaskItem } from "../adapters/TaskClasses";
  import { t } from "../localizer/Localizer";

  interface Props {
    // The entry to display and interact with.
    task: TaskItem;
    // Function (callback to parent) to mark an entry as done.
    markTaskAsDone: (x: TaskItem) => Promise<void>
    // Function (callback to parent) to delete entry.
    deleteTask: (x: TaskItem) => Promise<void>
  }

  let {
    task,
    markTaskAsDone,
    deleteTask
  }: Props = $props();

  let isDoneRunning = $state(false);
  let isDeleteRunning = $state(false);

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
    console.log("edit task " + task.title)
  }
</script>

<style>
  .container {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    position: relative;

    &:hover {
      background-color: var(--color-base-30);

      .btn-delete {
        opacity: 1;
      }
    }
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
  <!-- Button to mark task as "done" -->
  <button type="button" class="btn-done" onclick={onClickDone}>
    {#if !isDoneRunning}
      ✓
    {:else}
      <div class="spinner"></div>
    {/if}
  </button>
  <span class="description">{task.title}</span>
  <button type="button" class="btn-delete" onclick={onClickDelete}>
    {#if !isDeleteRunning}
      {t("view.btn-delete-text")}
    {:else}
      <div class="spinner"></div>
    {/if}
  </button>
</div>

