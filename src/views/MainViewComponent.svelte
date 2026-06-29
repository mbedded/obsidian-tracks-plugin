<script lang="ts">
  import type { ITaskAdapter } from "../adapters/ITaskAdapter";
  import { t } from "../localizer/Localizer";
  import { ContextItem } from "../adapters/TaskClasses";
  import SpinnerComponent from "./SpinnerComponent.svelte";
  import ContextComponent from "./ContextComponent.svelte";
  import ErrorComponent from "./ErrorComponent.svelte";
  import { onMount } from "svelte";
  import { SimpleMessenger } from "../messenger/SimpleMessenger";

  interface Props {
    adapter: ITaskAdapter;
  }

  let {
    adapter,
  }: Props = $props();

  let messenger = SimpleMessenger.getInstance();
  let loading = $state(true);
  let hasError = $state(false);
  let errorHeader = $state("error-header");
  let errorMessage = $state("error-message");

  let contexts: ContextItem[] = $state([]);

  onMount(() => {
    messenger.on("reload", initialize);

    void initialize();

    // A function can be returned, which will be called automatically when the component is destroyed.
    // So no separate "onDestroy" is needed.
    return () => {
      messenger.unregister("reload", initialize);
    };
  });

  async function initialize(): Promise<void> {
    loading = true;
    hasError = false;

    // Check if service is reachable
    let pingResult = await adapter.ping();

    if (pingResult.isReachable == false) {
      errorHeader = t("messages.service-unreachable-header");
      errorMessage = t("messages.service-unreachable-description");
    } else if (pingResult.isAuthenticated == false) {
      errorHeader = t("messages.service-authentication-failed-header");
      errorMessage = t("messages.service-authentication-failed-description");
    }

    // Initialize view when authentication is ok
    if (pingResult.isOk()) {
      contexts = await adapter.getActiveContexts();
    }

    loading = false;
    hasError = pingResult.isOk() == false;

    messenger.send("show_notice", t("notice.task-load-completed"));
  }
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    width: 100%;
  }

  .placeholder {
    border-top: 1px solid var(--color-base-20);
    margin-top: auto;
    align-content: center;
    color: var(--text-muted);
    font-size: 0.7em;
  }
</style>

<div class="container">
  {#if loading}
    <SpinnerComponent text={t("view.loading-contexts")} />
  {/if}

  {#if hasError}
    <ErrorComponent header={errorHeader} message={errorMessage} />
    <!-- todo: add reload button so user can press button instead of close/open tab -->
  {/if}

  {#if !loading && !hasError}
    <!-- todo: show hint  when context == empty-->
    <!-- todo: add reload button when user adds context via web UI-->

    {#each contexts as context}
      <ContextComponent adapter={adapter} context={context} />
    {/each}
  {/if}

  <!-- General information for the user at the bottom of the view -->
  <div class="placeholder">
    <p>{t("view.service")}: {adapter.getDisplayInfo()}</p>
  </div>
</div>




