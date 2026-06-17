<script lang="ts">
  let title = $state("");
  let description = $state("");

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && event.ctrlKey) {
      console.log("ctrl + enter pressed");
      event.preventDefault();
      handleSubmit();
    }
  }

  function handleSubmit() {
    // Handle submit here
    console.log({title, description});
  }

  // todo: localize
</script>

<div class="modal-content task-dialog">
  <h2>Create new task</h2>

  <!-- todo: add context selection where task is created -->

  <div class="setting-item setting-item-custom">
    <div class="setting-item-info">
      <label class="setting-item-name" for="title">Title</label>
    </div>

    <div class="setting-item-control">
      <input id="title" type="text" placeholder="Enter title"
             bind:value={title}
             onkeydown="{handleKeyDown}"
      />
    </div>
  </div>

  <div class="setting-item setting-item-custom">
    <div class="setting-item-info">
      <label class="setting-item-name" for="description">Description</label>
    </div>

    <div class="setting-item-control">
        <textarea id="description" rows="5" placeholder="Write text"
                  bind:value={description}
                  onkeydown="{handleKeyDown}"
        ></textarea>
    </div>
  </div>

  <div class="setting-item setting-item-custom task-dialog-actions">
    <div class="setting-item-info"></div>

    <div class="setting-item-control">
      <button type="button" class="btn-submit" onclick="{handleSubmit}">Create task</button>
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

  .task-dialog input,
  .task-dialog textarea {
    width: 100%;
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
  }

</style>
