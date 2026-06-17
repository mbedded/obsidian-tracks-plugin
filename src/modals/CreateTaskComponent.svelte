<script lang="ts">
  let title = $state("");
  let description = $state("");

  function submit() {
    // Handle submit here
    console.log({title, description});
  }

  // todo: localize
</script>

<div class="modal-content task-dialog">
  <h2>Create Item</h2>

  <form
    onsubmit={(event) => {
      event.preventDefault();
      submit();
    }}
  >
    <div class="setting-item">
      <div class="setting-item-info">
        <label class="setting-item-name" for="title">Title</label>
      </div>

      <div class="setting-item-control">
        <input
          id="title"
          type="text"
          bind:value={title}
          placeholder="Enter title"
        />
      </div>
    </div>

    <div class="setting-item">
      <div class="setting-item-info">
        <label class="setting-item-name" for="description">Description</label>
      </div>

      <div class="setting-item-control">
        <textarea
          id="description"
          rows="5"
          bind:value={description}
          placeholder="Write text"
        ></textarea>
      </div>
    </div>

    <div class="setting-item task-dialog-actions">
      <div class="setting-item-info"></div>

      <div class="setting-item-control">
        <button type="submit" class="mod-cta">Submit</button>
      </div>
    </div>
  </form>
</div>

<style>
  .task-dialog {
    width: 100%;
  }

  .task-dialog :global(.setting-item) {
    align-items: flex-start;
  }

  .task-dialog :global(.setting-item-info) {
    text-align: left;
    padding-top: var(--size-4-1);
  }

  .task-dialog :global(.setting-item-control) {
    flex: 1;
  }

  .task-dialog input,
  .task-dialog textarea {
    width: 100%;
  }

  .task-dialog textarea {
    resize: vertical;
  }

  .task-dialog-actions {
    border-top: none;
    padding-top: var(--size-4-3);
  }

  .task-dialog-actions :global(.setting-item-control) {
    justify-content: flex-end;
  }
</style>
