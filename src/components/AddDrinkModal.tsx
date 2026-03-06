import { h } from 'preact'
import { useState, useMemo } from 'preact/hooks'
import { HydrationStore } from '../HydrationStore'
import { allTemplates, settings, viewDate } from '../state'
import { DrinkTemplate, DrinkCategory, flOzToUnit, unitToFlOz, unitLabel, unitStep } from '../types'

interface Props {
	store: HydrationStore
	onClose: () => void
}

const CATEGORIES: DrinkCategory[] = [
	'water', 'coffee', 'tea', 'juice', 'soda',
	'energy_drink', 'sports_drink', 'milk', 'alcohol', 'smoothie', 'custom',
]

const CATEGORY_LABELS: Record<DrinkCategory, string> = {
	water: 'Water', coffee: 'Coffee', tea: 'Tea', juice: 'Juice', soda: 'Soda',
	energy_drink: 'Energy Drink', sports_drink: 'Sports Drink', milk: 'Milk',
	alcohol: 'Alcohol', smoothie: 'Smoothie', custom: 'Custom',
}

export function AddDrinkModal({ store, onClose }: Props) {
	const s = settings.value
	const unit = s.volumeUnit
	const templates = allTemplates.value

	const [query, setQuery] = useState('')
	const [selectedTemplate, setSelectedTemplate] = useState<DrinkTemplate | null>(null)
	const [amount, setAmount] = useState(flOzToUnit(8, unit))
	const [step] = useState(unitStep(unit))

	const filtered = useMemo(() => {
		const q = query.toLowerCase().trim()
		if (!q) return templates
		return templates.filter(
			t =>
				t.name.toLowerCase().includes(q) ||
				CATEGORY_LABELS[t.category].toLowerCase().includes(q),
		)
	}, [query, templates])

	async function handleLog() {
		if (!selectedTemplate) return
		const amount_floz = unitToFlOz(amount, unit)
		await store.addEntry({
			templateId: selectedTemplate.id,
			name: selectedTemplate.name,
			category: selectedTemplate.category,
			amount_floz,
			hydrationFactor: selectedTemplate.hydrationFactor,
			caffeinePerServing_mg: selectedTemplate.caffeinePerServing_mg,
			sugarPerServing_g: selectedTemplate.sugarPerServing_g,
			timestamp: new Date().toISOString(),
			date: viewDate.value,
		})
		onClose()
	}

	return (
		<div class="ht-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
			<div class="ht-modal">
				<div class="ht-modal-header">
					<h3>Log a Drink</h3>
					<button class="ht-btn-close" onClick={onClose}>✕</button>
				</div>

				<input
					class="ht-search"
					type="text"
					placeholder="Search drinks..."
					value={query}
					onInput={e => {
						setQuery((e.target as HTMLInputElement).value)
						setSelectedTemplate(null)
					}}
					autoFocus
				/>

				<div class="ht-drink-list">
					{CATEGORIES.map(cat => {
						const inCat = filtered.filter(t => t.category === cat)
						if (inCat.length === 0) return null
						return (
							<div key={cat}>
								<div class="ht-drink-category">{CATEGORY_LABELS[cat]}</div>
								{inCat.map(t => (
									<button
										key={t.id}
										class={`ht-drink-option ${selectedTemplate?.id === t.id ? 'ht-drink-option--selected' : ''}`}
										onClick={() => setSelectedTemplate(t)}
									>
										<span class="ht-drink-option-name">{t.name}</span>
										<span class="ht-drink-option-meta">
											{t.hydrationFactor >= 0 ? `+${(t.hydrationFactor * 100).toFixed(0)}%` : `${(t.hydrationFactor * 100).toFixed(0)}%`} hydration
											{t.caffeinePerServing_mg > 0 && ` · ${t.caffeinePerServing_mg}mg caffeine/serving`}
										</span>
									</button>
								))}
							</div>
						)
					})}
					{filtered.length === 0 && (
						<div class="ht-empty">No drinks match "{query}"</div>
					)}
				</div>

				{selectedTemplate && (
					<div class="ht-amount-row">
						<label class="ht-amount-label">
							Amount ({unitLabel(unit)})
						</label>
						<div class="ht-amount-controls">
							<button class="ht-btn-icon" onClick={() => setAmount(a => Math.max(step, +(a - step).toFixed(2)))}>−</button>
							<input
								class="ht-amount-input"
								type="number"
								min={step}
								step={step}
								value={amount}
								onInput={e => setAmount(parseFloat((e.target as HTMLInputElement).value) || step)}
							/>
							<button class="ht-btn-icon" onClick={() => setAmount(a => +(a + step).toFixed(2))}>+</button>
						</div>
					</div>
				)}

				<div class="ht-modal-footer">
					<button class="ht-btn-secondary" onClick={onClose}>Cancel</button>
					<button
						class="ht-btn-primary"
						disabled={!selectedTemplate}
						onClick={handleLog}
					>
						Log Drink
					</button>
				</div>
			</div>
		</div>
	)
}
