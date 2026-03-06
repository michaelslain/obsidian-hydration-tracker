import { Plugin, WorkspaceLeaf } from 'obsidian'
import { HydrationView, HYDRATION_VIEW_TYPE } from './HydrationView'
import { HydrationStore } from './HydrationStore'
import { HydrationSettingTab } from './SettingsTab'
import { HydrationSettings, DEFAULT_SETTINGS } from './types'
import { settings, obsidianPlugin } from './state'

export default class HydrationPlugin extends Plugin {
	private store!: HydrationStore
	settings!: HydrationSettings

	async onload() {
		await this.loadSettings()

		this.store = new HydrationStore(this.app)
		this.registerView(
			HYDRATION_VIEW_TYPE,
			leaf => new HydrationView(leaf, this.store),
		)
		this.addRibbonIcon('droplets', 'Open Hydration Tracker', () =>
			this.activateView(),
		)
		this.addCommand({
			id: 'open-hydration-tracker',
			name: 'Open Hydration Tracker',
			callback: () => this.activateView(),
		})
		this.addSettingTab(new HydrationSettingTab(this.app, this))
	}

	async loadSettings() {
		const data = await this.loadData()
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data)
		settings.value = this.settings
		obsidianPlugin.value = this
	}

	async saveSettings() {
		await this.saveData(this.settings)
		settings.value = { ...this.settings }
	}

	async activateView() {
		const { workspace } = this.app
		let leaf: WorkspaceLeaf | null =
			workspace.getLeavesOfType(HYDRATION_VIEW_TYPE)[0] ?? null
		if (!leaf) {
			leaf = workspace.getLeaf(true)
			await leaf.setViewState({ type: HYDRATION_VIEW_TYPE, active: true })
		}
		workspace.revealLeaf(leaf)
	}

	onunload() {}
}
