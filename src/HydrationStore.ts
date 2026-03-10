import { Plugin } from 'obsidian'
import { DrinkEntry, DrinkTemplate, BUILT_IN_DRINKS } from './types'
import { todayEntries, allTemplates, viewDate } from './state'

export class HydrationStore {
	private plugin: Plugin
	private entries: DrinkEntry[] = []
	private customTemplates: DrinkTemplate[] = []

	constructor(plugin: Plugin) {
		this.plugin = plugin
	}

	async load(): Promise<void> {
		const data = (await this.plugin.loadData()) ?? {}
		this.entries = data.entries ?? []
		this.customTemplates = data.customTemplates ?? []

		// Migrate from old separate files if needed
		if (this.entries.length === 0) {
			try {
				const raw = await this.plugin.app.vault.adapter.read(
					'.obsidian/plugins/hydration-tracker/entries.json',
				)
				const file = JSON.parse(raw)
				if (file.entries?.length) {
					this.entries = file.entries
					await this.saveEntries()
				}
			} catch {}
		}
		if (this.customTemplates.length === 0) {
			try {
				const raw = await this.plugin.app.vault.adapter.read(
					'.obsidian/plugins/hydration-tracker/templates.json',
				)
				const file = JSON.parse(raw)
				if (file.customTemplates?.length) {
					this.customTemplates = file.customTemplates
					await this.saveTemplates()
				}
			} catch {}
		}

		this.syncEntriesSignal()
		this.syncTemplatesSignal()
	}

	private async saveEntries(): Promise<void> {
		const existing = (await this.plugin.loadData()) ?? {}
		await this.plugin.saveData({ ...existing, entries: this.entries })
	}

	private async saveTemplates(): Promise<void> {
		const existing = (await this.plugin.loadData()) ?? {}
		await this.plugin.saveData({ ...existing, customTemplates: this.customTemplates })
	}

	private syncEntriesSignal(): void {
		const date = viewDate.value
		todayEntries.value = this.entries.filter(e => e.date === date)
	}

	private syncTemplatesSignal(): void {
		allTemplates.value = [...BUILT_IN_DRINKS, ...this.customTemplates]
	}

	getEntriesForDate(date: string): DrinkEntry[] {
		return this.entries.filter(e => e.date === date)
	}

	async addEntry(entry: Omit<DrinkEntry, 'id'>): Promise<DrinkEntry> {
		const id = crypto.randomUUID()
		const newEntry: DrinkEntry = { ...entry, id }
		this.entries.push(newEntry)
		await this.saveEntries()
		this.syncEntriesSignal()
		return newEntry
	}

	async deleteEntry(id: string): Promise<void> {
		this.entries = this.entries.filter(e => e.id !== id)
		await this.saveEntries()
		this.syncEntriesSignal()
	}

	async addCustomTemplate(template: Omit<DrinkTemplate, 'id' | 'isCustom'>): Promise<DrinkTemplate> {
		const id = 'custom_' + crypto.randomUUID()
		const newTemplate: DrinkTemplate = { ...template, id, isCustom: true }
		this.customTemplates.push(newTemplate)
		await this.saveTemplates()
		this.syncTemplatesSignal()
		return newTemplate
	}

	async deleteCustomTemplate(id: string): Promise<void> {
		this.customTemplates = this.customTemplates.filter(t => t.id !== id)
		await this.saveTemplates()
		this.syncTemplatesSignal()
	}

	setViewDate(date: string): void {
		viewDate.value = date
		this.syncEntriesSignal()
	}
}
