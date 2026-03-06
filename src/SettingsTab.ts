import { App, PluginSettingTab, Setting } from 'obsidian'
import { VolumeUnit } from './types'
import { settings } from './state'
import type HydrationPlugin from './main'

export class HydrationSettingTab extends PluginSettingTab {
	plugin: HydrationPlugin

	constructor(app: App, plugin: HydrationPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const { containerEl } = this
		containerEl.empty()

		containerEl.createEl('h2', { text: 'Hydration Tracker Settings' })

		new Setting(containerEl)
			.setName('Volume unit')
			.setDesc('Unit used to display and enter drink amounts.')
			.addDropdown(dd =>
				dd
					.addOption('fl_oz', 'Fluid Ounces (fl oz)')
					.addOption('ml', 'Milliliters (ml)')
					.addOption('cups', 'Cups')
					.setValue(this.plugin.settings.volumeUnit)
					.onChange(async (value: string) => {
						this.plugin.settings.volumeUnit = value as VolumeUnit
						settings.value = { ...this.plugin.settings }
						await this.plugin.saveSettings()
					}),
			)

		new Setting(containerEl)
			.setName('Daily hydration goal')
			.setDesc('Your target for net hydration per day (in fl oz, stored internally).')
			.addText(text =>
				text
					.setPlaceholder('64')
					.setValue(String(this.plugin.settings.dailyHydrationGoal_floz))
					.onChange(async (value: string) => {
						const num = parseFloat(value)
						if (!isNaN(num) && num > 0) {
							this.plugin.settings.dailyHydrationGoal_floz = num
							settings.value = { ...this.plugin.settings }
							await this.plugin.saveSettings()
						}
					}),
			)

		new Setting(containerEl)
			.setName('Daily caffeine limit (mg)')
			.setDesc('Maximum caffeine intake per day in milligrams.')
			.addText(text =>
				text
					.setPlaceholder('400')
					.setValue(String(this.plugin.settings.dailyCaffeineLimit_mg))
					.onChange(async (value: string) => {
						const num = parseFloat(value)
						if (!isNaN(num) && num > 0) {
							this.plugin.settings.dailyCaffeineLimit_mg = num
							settings.value = { ...this.plugin.settings }
							await this.plugin.saveSettings()
						}
					}),
			)
	}
}
