import { h } from 'preact'
import { useState } from 'preact/hooks'
import { HydrationStore } from '../HydrationStore'
import { allTemplates } from '../state'
import { DrinkTemplate, DrinkCategory } from '../types'

interface Props {
	store: HydrationStore
	onClose: () => void
}

const CATEGORY_LABELS: Record<DrinkCategory, string> = {
	water: 'Water', coffee: 'Coffee', tea: 'Tea', juice: 'Juice', soda: 'Soda',
	energy_drink: 'Energy Drink', sports_drink: 'Sports Drink', milk: 'Milk',
	alcohol: 'Alcohol', smoothie: 'Smoothie', custom: 'Custom',
}

const CATEGORIES: DrinkCategory[] = [
	'water', 'coffee', 'tea', 'juice', 'soda',
	'energy_drink', 'sports_drink', 'milk', 'alcohol', 'smoothie', 'custom',
]

const emptyForm = {
	name: '',
	category: 'custom' as DrinkCategory,
	hydrationFactor: 1.0,
	caffeinePerServing_mg: 0,
	sugarPerServing_g: 0,
}

export function ManageDrinksModal({ store, onClose }: Props) {
	const templates = allTemplates.value
	const customTemplates = templates.filter(t => t.isCustom)

	const [showForm, setShowForm] = useState(false)
	const [form, setForm] = useState({ ...emptyForm })
	const [error, setError] = useState('')

	function set<K extends keyof typeof emptyForm>(key: K, val: (typeof emptyForm)[K]) {
		setForm(f => ({ ...f, [key]: val }))
	}

	async function handleCreate() {
		if (!form.name.trim()) {
			setError('Name is required.')
			return
		}
		await store.addCustomTemplate({
			name: form.name.trim(),
			category: form.category,
			hydrationFactor: form.hydrationFactor,
			caffeinePerServing_mg: form.caffeinePerServing_mg,
			sugarPerServing_g: form.sugarPerServing_g,
		})
		setForm({ ...emptyForm })
		setShowForm(false)
		setError('')
	}

	return (
		<div class="ht-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
			<div class="ht-modal ht-modal--wide">
				<div class="ht-modal-header">
					<h3>Manage Custom Drinks</h3>
					<button class="ht-btn-close" onClick={onClose}>✕</button>
				</div>

				<div class="ht-manage-section">
					<div class="ht-manage-header">
						<span>Custom Drinks ({customTemplates.length})</span>
						<button class="ht-btn-sm" onClick={() => setShowForm(s => !s)}>
							{showForm ? 'Cancel' : '+ Add Custom'}
						</button>
					</div>

					{showForm && (
						<div class="ht-form">
							<div class="ht-form-row">
								<label>Name</label>
								<input
									class="ht-input"
									type="text"
									value={form.name}
									placeholder="e.g. Yerba Mate"
									onInput={e => set('name', (e.target as HTMLInputElement).value)}
								/>
							</div>
							<div class="ht-form-row">
								<label>Category</label>
								<select
									class="ht-input"
									value={form.category}
									onChange={e => set('category', (e.target as HTMLSelectElement).value as DrinkCategory)}
								>
									{CATEGORIES.map(c => (
										<option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
									))}
								</select>
							</div>
							<div class="ht-form-row">
								<label>
									Hydration Factor
									<span class="ht-hint"> (1.0 = fully hydrating, negative = dehydrating)</span>
								</label>
								<input
									class="ht-input"
									type="number"
									step="0.05"
									min="-2"
									max="2"
									value={form.hydrationFactor}
									onInput={e => set('hydrationFactor', parseFloat((e.target as HTMLInputElement).value))}
								/>
							</div>
							<div class="ht-form-row">
								<label>Caffeine per 8 fl oz serving (mg)</label>
								<input
									class="ht-input"
									type="number"
									min="0"
									step="1"
									value={form.caffeinePerServing_mg}
									onInput={e => set('caffeinePerServing_mg', parseFloat((e.target as HTMLInputElement).value))}
								/>
							</div>
							<div class="ht-form-row">
								<label>Sugar per 8 fl oz serving (g)</label>
								<input
									class="ht-input"
									type="number"
									min="0"
									step="0.5"
									value={form.sugarPerServing_g}
									onInput={e => set('sugarPerServing_g', parseFloat((e.target as HTMLInputElement).value))}
								/>
							</div>
							{error && <div class="ht-error">{error}</div>}
							<div class="ht-form-actions">
								<button class="ht-btn-primary" onClick={handleCreate}>Create</button>
							</div>
						</div>
					)}

					{customTemplates.length === 0 && !showForm ? (
						<div class="ht-empty">No custom drinks yet. Add one above!</div>
					) : (
						customTemplates.map(t => (
							<CustomDrinkRow key={t.id} template={t} onDelete={() => store.deleteCustomTemplate(t.id)} />
						))
					)}
				</div>

				<div class="ht-manage-section">
					<div class="ht-manage-header">Built-in Drinks ({templates.filter(t => !t.isCustom).length})</div>
					<div class="ht-builtin-list">
						{templates.filter(t => !t.isCustom).map(t => (
							<div key={t.id} class="ht-builtin-row">
								<span class="ht-builtin-name">{t.name}</span>
								<span class="ht-builtin-meta">
									{CATEGORY_LABELS[t.category]}
									{' · '}{t.hydrationFactor >= 0 ? '+' : ''}{(t.hydrationFactor * 100).toFixed(0)}% hydration
									{t.caffeinePerServing_mg > 0 && ` · ${t.caffeinePerServing_mg}mg caffeine`}
									{t.sugarPerServing_g > 0 && ` · ${t.sugarPerServing_g}g sugar`}
								</span>
							</div>
						))}
					</div>
				</div>

				<div class="ht-modal-footer">
					<button class="ht-btn-primary" onClick={onClose}>Done</button>
				</div>
			</div>
		</div>
	)
}

function CustomDrinkRow({ template, onDelete }: { template: DrinkTemplate; onDelete: () => void }) {
	return (
		<div class="ht-entry-row">
			<div class="ht-entry-info">
				<div class="ht-entry-name">{template.name}</div>
				<div class="ht-entry-meta">
					{CATEGORY_LABELS[template.category]}
					{' · '}{template.hydrationFactor >= 0 ? '+' : ''}{(template.hydrationFactor * 100).toFixed(0)}% hydration
					{template.caffeinePerServing_mg > 0 && ` · ${template.caffeinePerServing_mg}mg caffeine/serving`}
					{template.sugarPerServing_g > 0 && ` · ${template.sugarPerServing_g}g sugar/serving`}
				</div>
			</div>
			<button class="ht-btn-delete" onClick={onDelete} title="Delete drink">✕</button>
		</div>
	)
}
