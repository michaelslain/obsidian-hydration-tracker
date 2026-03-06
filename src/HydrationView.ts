import { ItemView, WorkspaceLeaf } from 'obsidian'
import { render, h } from 'preact'
import { App as HydrationApp } from './components/App'
import { HydrationStore } from './HydrationStore'

export const HYDRATION_VIEW_TYPE = 'hydration-tracker-view'

export class HydrationView extends ItemView {
	private store: HydrationStore

	constructor(leaf: WorkspaceLeaf, store: HydrationStore) {
		super(leaf)
		this.store = store
	}

	getViewType() {
		return HYDRATION_VIEW_TYPE
	}
	getDisplayText() {
		return 'Hydration Tracker'
	}
	getIcon() {
		return 'droplets'
	}

	async onOpen() {
		await this.store.load()
		render(
			h(HydrationApp, { store: this.store }),
			this.containerEl.children[1] as HTMLElement,
		)
	}

	async onClose() {
		render(null, this.containerEl.children[1] as HTMLElement)
	}
}
