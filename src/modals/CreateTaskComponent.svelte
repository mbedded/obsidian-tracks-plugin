<script lang="ts">
  import { onMount, tick } from "svelte";
  import type { ContextItem } from "../adapters/TaskClasses";
  import { t } from "../localizer/Localizer";

  interface Props {
    contexts: ContextItem[];
    onSubmit: (title: string, description: string) => Promise<void>;
  }

  let {
    contexts,
    onSubmit
  }: Props = $props();

  const CONTEXT_ID_UNDEFINED = -1;
  let title = $state("");
  let description = $state("");
  let selectedContextId = $state(0);

  let titleInput: HTMLInputElement;

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  onMount(async () => {
    await tick();
    selectedContextId = contexts[0]?.id ?? CONTEXT_ID_UNDEFINED;
    titleInput.focus();
  });

  function handleSubmit() {
    if (title.trim().length === 0) {
      return;
    }

    onSubmit(title.trim(), description.trim());
  }

  // todo: localize
</script>

<div class="modal-content task-dialog">
  <h2>Create new task</h2>

  <!-- Context dropdown -->
  <div class="setting-item setting-item-custom">
    <div class="setting-item-info">
      <label class="setting-item-name" for="context">{t("view.context")}</label>
    </div>

    <div class="setting-item-control">
      <select id="context" bind:value={selectedContextId} class="dropdown">
        {#each contexts as context}
          <option value={context.id}>{context.name}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Title textbox -->
  <div class="setting-item setting-item-custom">
    <div class="setting-item-info">
      <label class="setting-item-name" for="title">{t("view.title")}</label>
    </div>

    <div class="setting-item-control">
      <input id="title" type="text" placeholder="Enter a short, descriptive title"
             bind:this={titleInput}
             bind:value={title}
             onkeydown="{handleKeyDown}" />
    </div>
  </div>

  <!-- Description textarea -->
  <div class="setting-item setting-item-custom">
    <div class="setting-item-info">
      <label class="setting-item-name" for="description">{t("view.description")}</label>
      <label class="setting-item-name" for="description">{t("view.optional")}</label>
    </div>

    <div class="setting-item-control">
        <textarea id="description" rows="5" placeholder="Provide additional information for this task"
                  bind:value={description}
                  onkeydown="{handleKeyDown}"></textarea>
    </div>
  </div>

  <div class="setting-item setting-item-custom task-dialog-actions">
    <div class="setting-item-info"></div>

    <div class="setting-item-control">
      <button type="button" class="btn-submit"
              disabled={title.trim().length === 0}
              onclick="{handleSubmit}">Create task
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
