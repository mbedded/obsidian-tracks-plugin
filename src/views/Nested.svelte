<script lang="ts">
	interface Props {
		// done: boolean;
		text: string;
	}

	let {
		// done,
		text
	}: Props = $props();
</script>

<p>Text: {text}</p>
