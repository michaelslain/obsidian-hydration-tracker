import { App, normalizePath } from 'obsidian'
import { DrinkEntry, DrinkTemplate, BUILT_IN_DRINKS } from './types'
import { todayEntries, allTemplates, viewDate } from './state'

const ENTRIES_PATH = normalizePath('.obsidian/plugins/hydration-tracker/entries.json')
const TEMPLATES_PATH = normalizePath('.obsidian/plugins/hydration-tracker/templates.json')

interface EntriesFile {
	entries: DrinkEntry[]
}

interface TemplatesFile {
	customTemplates: DrinkTemplate[]
}

export class HydrationStore {
	private app: App
	private entries: DrinkEntry[] = []
	private customTemplates: DrinkTemplate[] = []

	constructor(app: App) {
		this.app = app
	}

	async load(): Promise<void> {
		await this.loadEntries()
		await this.loadTemplates()
	}

	private async loadEntries(): Promise<void> {
		try {
			const raw = await this.app.vault.adapter.read(ENTRIES_PATH)
			const file: EntriesFile = JSON.parse(raw)
			this.entries = file.entries ?? []
		} catch {
			this.entries = []
		}
		this.syncEntriesSignal()
	}

	private async loadTemplates(): Promise<void> {
		try {
			const raw = await this.app.vault.adapter.read(TEMPLATES_PATH)
			const file: TemplatesFile = JSON.parse(raw)
			this.customTemplates = file.customTemplates ?? []
		} catch {
			this.customTemplates = []
		}
		this.syncTemplatesSignal()
	}

	private async saveEntries(): Promise<void> {
		await this.ensureDir(ENTRIES_PATH)
		await this.app.vault.adapter.write(
			ENTRIES_PATH,
			JSON.stringify({ entries: this.entries }, null, 2),
		)
	}

	private async saveTemplates(): Promise<void> {
		await this.ensureDir(TEMPLATES_PATH)
		await this.app.vault.adapter.write(
			TEMPLATES_PATH,
			JSON.stringify({ customTemplates: this.customTemplates }, null, 2),
		)
	}

	private async ensureDir(path: string): Promise<void> {
		const dir = path.split('/').slice(0, -1).join('/')
		if (dir && !(await this.app.vault.adapter.exists(dir))) {
			await this.app.vault.adapter.mkdir(dir)
		}
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
