<script lang="ts">
  import Nested from "./Nested.svelte";

  interface Props {
    startCount: number;
  }

  let {
    startCount
  }: Props = $props();

  let count = $state(startCount);

  let components: string[] = $state([]);

  export function increment() {
    count += 1;
  }

  function addComponent() {
    console.log("add component");
    components.push(`Nested ${components.length}`);
  }
</script>

<div class="number">
  <span>My number is {count}!</span>
</div>

<button onclick={()=>addComponent()}>Add component</button>

<p>COMPONENTS:</p>

{#each components as item}
  <Nested text={item}/>
{/each}


<style>
  .number {
    color: red;
  }
</style>
