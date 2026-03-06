import { h } from 'preact'
import { DrinkEntry, VolumeUnit, flOzToUnit, unitLabel } from '../types'

interface Props {
	entry: DrinkEntry
	unit: VolumeUnit
	icon: string
	onDelete: () => void
}

export function DrinkEntryRow({ entry, unit, icon, onDelete }: Props) {
	const displayAmount = flOzToUnit(entry.amount_floz, unit)
	const servings = entry.amount_floz / 8
	const caffeine = Math.round(entry.caffeinePerServing_mg * servings)
	const sugar = (entry.sugarPerServing_g * servings).toFixed(1)
	const netHydration = flOzToUnit(entry.amount_floz * entry.hydrationFactor, unit)
	const time = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

	return (
		<div class="ht-entry-row">
			<div class="ht-entry-icon">{icon}</div>
			<div class="ht-entry-info">
				<div class="ht-entry-name">{entry.name}</div>
				<div class="ht-entry-meta">
					{displayAmount.toFixed(1)} {unitLabel(unit)}
					{caffeine > 0 && <span class="ht-tag ht-tag-caffeine">☕ {caffeine}mg</span>}
					{parseFloat(sugar) > 0 && <span class="ht-tag ht-tag-sugar">🍬 {sugar}g</span>}
					<span class={`ht-tag ${entry.hydrationFactor < 0 ? 'ht-tag-dehydrate' : 'ht-tag-hydrate'}`}>
						{entry.hydrationFactor < 0 ? '−' : '+'}{Math.abs(netHydration).toFixed(1)} {unitLabel(unit)}
					</span>
				</div>
			</div>
			<div class="ht-entry-time">{time}</div>
			<button class="ht-btn-delete" onClick={onDelete} title="Delete entry">✕</button>
		</div>
	)
}
