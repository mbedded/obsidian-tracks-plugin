<script lang="ts">
  import { type ContextItem, TaskItem } from "../adapters/TaskClasses";
  import type { ITaskAdapter } from "../adapters/ITaskAdapter";
  import { onMount } from "svelte";
  import SpinnerComponent from "./SpinnerComponent.svelte";
  import TaskComponent from "./TaskComponent.svelte";
  import { t } from "../localizer/Localizer";
  import type { IMessenger, TaskCreatedEventArgs, TaskUpdatedEventArgs } from "../messenger/IMessenger";

  interface Props {
    adapter: ITaskAdapter;
    messenger: IMessenger;
    context: ContextItem;
  }

  let {
    context,
    messenger,
    adapter
  }: Props = $props();

  let isLoading = $state(false);
  let isSaving = $state(false);
  let tasks: TaskItem[] = $state([]);
  let newTaskTitle = $state("");

  onMount(() => {
    messenger.on("task_created", handleTaskCreated);
    messenger.on("task_updated", handleTaskUpdated);

    void initialize();

    return () => {
      messenger.unregister("task_created", handleTaskCreated);
      messenger.unregister("task_updated", handleTaskUpdated);
    };
  });

  async function initialize() {
    isLoading = true;
    tasks = await adapter.getActiveTasks(context.id);
    isLoading = false;
  }

  async function markTaskAsDone(task: TaskItem): Promise<void> {
    let result = await adapter.toggleTaskState(task.id);

    if (result) {
      tasks = tasks.filter(x => x.id !== task.id);
    }
  }

  async function deleteTask(task: TaskItem): Promise<void> {
    let result = await adapter.deleteTask(task.id);

    if (result) {
      tasks = tasks.filter(x => x.id !== task.id);
    }
  }

  async function onTxtNewTaskKeyDown(e: KeyboardEvent) {
    if (e.key !== "Enter") {
      return;
    }

    if (!newTaskTitle.trim()) {
      return;
    }

    isSaving = true;
    try {
      let newTask = await adapter.createTask(context.id, newTaskTitle, "");

      if (newTask) {
        tasks = [...tasks, newTask];
        newTaskTitle = "";
      }
    } finally {
      isSaving = false;
    }
  }

  function handleTaskCreated(event: TaskCreatedEventArgs) {
    if (context.id != event.contextId) {
      return;
    }

    tasks.push(new TaskItem(event.taskId, event.contextId, event.title, event.description));
  }

  function handleTaskUpdated(event: TaskUpdatedEventArgs) {
    // Check if this is an existing task
    let task = tasks.find(x => x.id === event.taskId);

    if (!!task) {
      // Task exists, so we must update the properties or delete it.
      if (context.id == event.contextId) {
        // Update properties. We must use "map" to trigger an update of the UI.
        tasks = tasks.map(x => x.id === event.taskId ? new TaskItem(x.id, x.contextId, event.title, event.description) : x);
      } else {
        // Context has changed, remove the task
        tasks.remove(task);
      }
    } else {
      // Task doesn't exist. So we may need to create a new one
      if (context.id == event.contextId) {
        console.log("task pushed");
        tasks.push(new TaskItem(event.taskId, event.contextId, event.title, event.description));
      }
    }
  }
</script>

<style>
  .container {
    border: 1px solid var(--background-modifier-border);
    padding: 5px 10px;
    margin: 5px;
  }

  .header {
    margin: 0 0 10px 0;
    font-weight: var(--bold-weight);
    color: var(--text-normal);
    font-size: var(--font-ui-large);
    line-height: var(--line-height-normal);

    span {
      color: var(--text-faint);
    }
  }

  .no-tasks-existing {
    color: var(--text-muted);
  }

  .txt-new-task {
    width: 100%;
  }
</style>

<div class="container">
  <p class="header">{context.name} <span>({tasks.length})</span></p>

  {#if isLoading}
    <SpinnerComponent text={t("view.lbl-loading-tasks")} />
  {/if}

  {#if !!tasks && tasks.length }
    {#each tasks as task (task.id)}
      <TaskComponent task={task}
                     markTaskAsDone={markTaskAsDone}
                     deleteTask={deleteTask}
                     messenger={messenger} />
    {/each}

  {:else}
    <p class="no-tasks-existing">{t("view.txt-no-tasks-existing")}</p>
  {/if}

  <input class="txt-new-task"
         type="text"
         bind:value={newTaskTitle}
         onkeydown={onTxtNewTaskKeyDown}
         placeholder={t("view.plh-add-new-task")}
         readonly={isSaving} />

  {#if isSaving}
    <SpinnerComponent text={t("view.txt-saving")} />
  {/if}
</div>
