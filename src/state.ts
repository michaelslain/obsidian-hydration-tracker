import { signal } from '@preact/signals'
import { HydrationSettings, DEFAULT_SETTINGS, DrinkEntry, DrinkTemplate, BUILT_IN_DRINKS } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const obsidianPlugin = signal<any>(null)

export const settings = signal<HydrationSettings>(DEFAULT_SETTINGS)

export const todayEntries = signal<DrinkEntry[]>([])

export const allTemplates = signal<DrinkTemplate[]>(BUILT_IN_DRINKS)

export const searchQuery = signal<string>('')

/** Currently viewed date YYYY-MM-DD */
export const viewDate = signal<string>(new Date().toISOString().split('T')[0])
