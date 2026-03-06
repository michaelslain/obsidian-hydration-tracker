import { h } from 'preact'
import { useComputed } from '@preact/signals'
import { todayEntries, settings, viewDate } from '../state'
import { HydrationStore } from '../HydrationStore'
import { flOzToUnit, unitLabel, DrinkEntry, DrinkCategory } from '../types'
import { DrinkEntryRow } from './DrinkEntryRow'

interface Props {
	store: HydrationStore
	onAddDrink: () => void
	onManageDrinks: () => void
}

const CATEGORY_ICONS: Record<DrinkCategory, string> = {
	water: '💧',
	coffee: '☕',
	tea: '🍵',
	juice: '🥤',
	soda: '🫧',
	energy_drink: '⚡',
	sports_drink: '🏃',
	milk: '🥛',
	alcohol: '🍺',
	smoothie: '🥤',
	custom: '✨',
}

export function DashboardView({ store, onAddDrink, onManageDrinks }: Props) {
	const entries = todayEntries.value
	const s = settings.value
	const unit = s.volumeUnit

	const netHydration_floz = useComputed(() =>
		todayEntries.value.reduce(
			(sum, e) => sum + e.amount_floz * e.hydrationFactor,
			0,
		),
	).value

	const totalCaffeine_mg = useComputed(() =>
		todayEntries.value.reduce((sum, e) => {
			const servings = e.amount_floz / 8
			return sum + e.caffeinePerServing_mg * servings
		}, 0),
	).value

	const totalSugar_g = useComputed(() =>
		todayEntries.value.reduce((sum, e) => {
			const servings = e.amount_floz / 8
			return sum + e.sugarPerServing_g * servings
		}, 0),
	).value

	const hydrationGoal_display = flOzToUnit(s.dailyHydrationGoal_floz, unit)
	const netHydration_display = flOzToUnit(netHydration_floz, unit)
	const hydrationPct = Math.min(
		100,
		Math.max(0, (netHydration_floz / s.dailyHydrationGoal_floz) * 100),
	)
	const caffeinePct = Math.min(100, (totalCaffeine_mg / s.dailyCaffeineLimit_mg) * 100)

	const today = new Date().toISOString().split('T')[0]
	const isToday = viewDate.value === today

	function changeDate(delta: number) {
		const d = new Date(viewDate.value + 'T00:00:00')
		d.setDate(d.getDate() + delta)
		store.setViewDate(d.toISOString().split('T')[0])
	}

	function goToday() {
		store.setViewDate(today)
	}

	return (
		<div class="ht-dashboard">
			{/* Date nav */}
			<div class="ht-date-nav">
				<button class="ht-btn-icon" onClick={() => changeDate(-1)} title="Previous day">‹</button>
				<span class="ht-date-label">
					{isToday ? 'Today' : viewDate.value}
				</span>
				<button class="ht-btn-icon" onClick={() => changeDate(1)} title="Next day">›</button>
				{!isToday && (
					<button class="ht-btn-sm" onClick={goToday}>Today</button>
				)}
			</div>

			{/* Goal cards */}
			<div class="ht-cards">
				<div class="ht-card">
					<div class="ht-card-label">Hydration</div>
					<div class="ht-card-value">
						{fmt(netHydration_display)} / {fmt(hydrationGoal_display)} {unitLabel(unit)}
					</div>
					<div class="ht-progress-bar">
						<div
							class={`ht-progress-fill ${hydrationPct >= 100 ? 'ht-progress-complete' : ''}`}
							style={{ width: `${hydrationPct}%` }}
						/>
					</div>
					<div class="ht-card-pct">{Math.round(hydrationPct)}%</div>
				</div>

				<div class="ht-card">
					<div class="ht-card-label">Caffeine</div>
					<div class="ht-card-value">
						{Math.round(totalCaffeine_mg)} / {Math.round(s.dailyCaffeineLimit_mg)} mg
					</div>
					<div class="ht-progress-bar">
						<div
							class={`ht-progress-fill ht-progress-caffeine ${caffeinePct >= 100 ? 'ht-progress-over' : ''}`}
							style={{ width: `${caffeinePct}%` }}
						/>
					</div>
					<div class="ht-card-pct">{Math.round(caffeinePct)}%</div>
				</div>

				<div class="ht-card ht-card-sugar">
					<div class="ht-card-label">Sugar</div>
					<div class="ht-card-value">{fmt(totalSugar_g)} g</div>
				</div>
			</div>

			{/* Actions */}
			<div class="ht-actions">
				<button class="ht-btn-primary" onClick={onAddDrink}>+ Log Drink</button>
				<button class="ht-btn-secondary" onClick={onManageDrinks}>Manage Drinks</button>
			</div>

			{/* Entry list */}
			<div class="ht-entries">
				{entries.length === 0 ? (
					<div class="ht-empty">No drinks logged yet. Hit "Log Drink" to start!</div>
				) : (
					entries.map(entry => (
						<DrinkEntryRow
							key={entry.id}
							entry={entry}
							unit={unit}
							icon={CATEGORY_ICONS[entry.category] ?? '🥤'}
							onDelete={() => store.deleteEntry(entry.id)}
						/>
					))
				)}
			</div>
		</div>
	)
}

function fmt(n: number): string {
	return Number.isInteger(n) ? String(n) : n.toFixed(1)
}
