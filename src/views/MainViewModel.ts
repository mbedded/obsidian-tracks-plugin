import { ItemView, WorkspaceLeaf } from 'obsidian';

// Import the MainView Svelte component and the `mount` and `unmount` methods.
import MainView from './MainView.svelte';
import { mount, unmount } from 'svelte';

export const VIEW_TYPE_EXAMPLE = 'example-views';

export class MainViewModel extends ItemView {
	// A variable to hold on to the MainView instance mounted in this ItemView.
	counter: ReturnType<typeof MainView> | undefined;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_EXAMPLE;
	}

	getDisplayText() {
		return 'Example views';
	}

	async onOpen() {
		// Attach the Svelte component to the ItemViews content element and provide the needed props.
		this.counter = mount(MainView, {
			target: this.contentEl,
			props: {
				startCount: 5,
			}
		});

		// Since the component instance is typed, the exported `increment` method is known to TypeScript.
		this.counter.increment();
	}

	async onClose() {
		if (this.counter) {
			// Remove the MainView from the ItemView.
			unmount(this.counter);
		}
	}
}
