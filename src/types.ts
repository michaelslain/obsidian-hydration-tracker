export type VolumeUnit = 'fl_oz' | 'ml' | 'cups'

export type DrinkCategory =
	| 'water'
	| 'coffee'
	| 'tea'
	| 'juice'
	| 'soda'
	| 'energy_drink'
	| 'sports_drink'
	| 'milk'
	| 'alcohol'
	| 'smoothie'
	| 'custom'

export interface DrinkTemplate {
	id: string
	name: string
	category: DrinkCategory
	/** Hydration factor: 1.0 = fully hydrating, negative = dehydrating */
	hydrationFactor: number
	/** Caffeine in mg per 8 fl oz serving */
	caffeinePerServing_mg: number
	/** Sugar in grams per 8 fl oz serving */
	sugarPerServing_g: number
	isCustom?: boolean
}

export interface DrinkEntry {
	id: string
	templateId: string
	name: string
	category: DrinkCategory
	/** Volume in fl oz (stored normalized, displayed in user's unit) */
	amount_floz: number
	hydrationFactor: number
	caffeinePerServing_mg: number
	sugarPerServing_g: number
	timestamp: string // ISO
	date: string // YYYY-MM-DD
}

export interface DailyLog {
	date: string
	entries: DrinkEntry[]
}

export interface HydrationSettings {
	volumeUnit: VolumeUnit
	/** Daily hydration goal in fl oz */
	dailyHydrationGoal_floz: number
	/** Daily caffeine limit in mg */
	dailyCaffeineLimit_mg: number
}

export const DEFAULT_SETTINGS: HydrationSettings = {
	volumeUnit: 'fl_oz',
	dailyHydrationGoal_floz: 64,
	dailyCaffeineLimit_mg: 400,
}

// Conversion helpers
export const FL_OZ_TO_ML = 29.5735
export const FL_OZ_TO_CUPS = 0.125

export function flOzToUnit(floz: number, unit: VolumeUnit): number {
	if (unit === 'ml') return floz * FL_OZ_TO_ML
	if (unit === 'cups') return floz * FL_OZ_TO_CUPS
	return floz
}

export function unitToFlOz(amount: number, unit: VolumeUnit): number {
	if (unit === 'ml') return amount / FL_OZ_TO_ML
	if (unit === 'cups') return amount / FL_OZ_TO_CUPS
	return amount
}

export function unitLabel(unit: VolumeUnit): string {
	if (unit === 'ml') return 'ml'
	if (unit === 'cups') return 'cups'
	return 'fl oz'
}

export function unitStep(unit: VolumeUnit): number {
	if (unit === 'ml') return 10
	if (unit === 'cups') return 0.25
	return 1
}

export const BUILT_IN_DRINKS: DrinkTemplate[] = [
	// Water
	{ id: 'water', name: 'Water', category: 'water', hydrationFactor: 1.0, caffeinePerServing_mg: 0, sugarPerServing_g: 0 },
	{ id: 'sparkling_water', name: 'Sparkling Water', category: 'water', hydrationFactor: 1.0, caffeinePerServing_mg: 0, sugarPerServing_g: 0 },
	{ id: 'coconut_water', name: 'Coconut Water', category: 'water', hydrationFactor: 1.0, caffeinePerServing_mg: 0, sugarPerServing_g: 6 },
	// Coffee
	{ id: 'black_coffee', name: 'Black Coffee', category: 'coffee', hydrationFactor: 0.8, caffeinePerServing_mg: 95, sugarPerServing_g: 0 },
	{ id: 'latte', name: 'Latte', category: 'coffee', hydrationFactor: 0.8, caffeinePerServing_mg: 75, sugarPerServing_g: 10 },
	{ id: 'espresso', name: 'Espresso', category: 'coffee', hydrationFactor: 0.8, caffeinePerServing_mg: 63, sugarPerServing_g: 0 },
	{ id: 'cold_brew', name: 'Cold Brew', category: 'coffee', hydrationFactor: 0.8, caffeinePerServing_mg: 155, sugarPerServing_g: 0 },
	{ id: 'cappuccino', name: 'Cappuccino', category: 'coffee', hydrationFactor: 0.8, caffeinePerServing_mg: 75, sugarPerServing_g: 8 },
	{ id: 'americano', name: 'Americano', category: 'coffee', hydrationFactor: 0.8, caffeinePerServing_mg: 94, sugarPerServing_g: 0 },
	{ id: 'flat_white', name: 'Flat White', category: 'coffee', hydrationFactor: 0.8, caffeinePerServing_mg: 130, sugarPerServing_g: 1 },
	{ id: 'macchiato', name: 'Macchiato', category: 'coffee', hydrationFactor: 0.8, caffeinePerServing_mg: 63, sugarPerServing_g: 5 },
	{ id: 'mocha', name: 'Mocha', category: 'coffee', hydrationFactor: 0.75, caffeinePerServing_mg: 95, sugarPerServing_g: 25 },
	{ id: 'iced_coffee', name: 'Iced Coffee', category: 'coffee', hydrationFactor: 0.8, caffeinePerServing_mg: 95, sugarPerServing_g: 5 },
	{ id: 'french_press', name: 'French Press', category: 'coffee', hydrationFactor: 0.8, caffeinePerServing_mg: 107, sugarPerServing_g: 0 },
	// Tea
	{ id: 'green_tea', name: 'Green Tea', category: 'tea', hydrationFactor: 0.9, caffeinePerServing_mg: 28, sugarPerServing_g: 0 },
	{ id: 'black_tea', name: 'Black Tea', category: 'tea', hydrationFactor: 0.9, caffeinePerServing_mg: 47, sugarPerServing_g: 0 },
	{ id: 'herbal_tea', name: 'Herbal Tea', category: 'tea', hydrationFactor: 1.0, caffeinePerServing_mg: 0, sugarPerServing_g: 0 },
	{ id: 'chai_latte', name: 'Chai Latte', category: 'tea', hydrationFactor: 0.85, caffeinePerServing_mg: 50, sugarPerServing_g: 20 },
	{ id: 'matcha', name: 'Matcha', category: 'tea', hydrationFactor: 0.9, caffeinePerServing_mg: 70, sugarPerServing_g: 2 },
	// Juice
	{ id: 'orange_juice', name: 'Orange Juice', category: 'juice', hydrationFactor: 0.85, caffeinePerServing_mg: 0, sugarPerServing_g: 26 },
	{ id: 'apple_juice', name: 'Apple Juice', category: 'juice', hydrationFactor: 0.85, caffeinePerServing_mg: 0, sugarPerServing_g: 28 },
	{ id: 'grape_juice', name: 'Grape Juice', category: 'juice', hydrationFactor: 0.85, caffeinePerServing_mg: 0, sugarPerServing_g: 36 },
	{ id: 'cranberry_juice', name: 'Cranberry Juice', category: 'juice', hydrationFactor: 0.85, caffeinePerServing_mg: 0, sugarPerServing_g: 31 },
	// Soda
	{ id: 'cola', name: 'Cola', category: 'soda', hydrationFactor: 0.6, caffeinePerServing_mg: 34, sugarPerServing_g: 39 },
	{ id: 'diet_cola', name: 'Diet Cola', category: 'soda', hydrationFactor: 0.7, caffeinePerServing_mg: 46, sugarPerServing_g: 0 },
	{ id: 'lemon_soda', name: 'Lemon-Lime Soda', category: 'soda', hydrationFactor: 0.6, caffeinePerServing_mg: 0, sugarPerServing_g: 38 },
	{ id: 'ginger_ale', name: 'Ginger Ale', category: 'soda', hydrationFactor: 0.6, caffeinePerServing_mg: 0, sugarPerServing_g: 32 },
	{ id: 'root_beer', name: 'Root Beer', category: 'soda', hydrationFactor: 0.6, caffeinePerServing_mg: 22, sugarPerServing_g: 39 },
	// Energy Drinks
	{ id: 'red_bull', name: 'Red Bull', category: 'energy_drink', hydrationFactor: 0.5, caffeinePerServing_mg: 80, sugarPerServing_g: 27 },
	{ id: 'monster', name: 'Monster Energy', category: 'energy_drink', hydrationFactor: 0.5, caffeinePerServing_mg: 160, sugarPerServing_g: 54 },
	{ id: 'bang', name: 'Bang Energy', category: 'energy_drink', hydrationFactor: 0.5, caffeinePerServing_mg: 300, sugarPerServing_g: 0 },
	{ id: 'celsius', name: 'Celsius', category: 'energy_drink', hydrationFactor: 0.6, caffeinePerServing_mg: 200, sugarPerServing_g: 0 },
	{ id: 'prime', name: 'Prime Energy', category: 'energy_drink', hydrationFactor: 0.7, caffeinePerServing_mg: 200, sugarPerServing_g: 0 },
	// Sports Drinks
	{ id: 'gatorade', name: 'Gatorade', category: 'sports_drink', hydrationFactor: 0.9, caffeinePerServing_mg: 0, sugarPerServing_g: 21 },
	{ id: 'powerade', name: 'Powerade', category: 'sports_drink', hydrationFactor: 0.9, caffeinePerServing_mg: 0, sugarPerServing_g: 21 },
	{ id: 'liquid_iv', name: 'Liquid I.V.', category: 'sports_drink', hydrationFactor: 1.2, caffeinePerServing_mg: 0, sugarPerServing_g: 11 },
	{ id: 'pedialyte', name: 'Pedialyte', category: 'sports_drink', hydrationFactor: 1.1, caffeinePerServing_mg: 0, sugarPerServing_g: 4 },
	// Milk
	{ id: 'whole_milk', name: 'Whole Milk', category: 'milk', hydrationFactor: 1.5, caffeinePerServing_mg: 0, sugarPerServing_g: 12 },
	{ id: 'skim_milk', name: 'Skim Milk', category: 'milk', hydrationFactor: 1.58, caffeinePerServing_mg: 0, sugarPerServing_g: 12 },
	{ id: 'oat_milk', name: 'Oat Milk', category: 'milk', hydrationFactor: 0.95, caffeinePerServing_mg: 0, sugarPerServing_g: 7 },
	{ id: 'almond_milk', name: 'Almond Milk', category: 'milk', hydrationFactor: 0.95, caffeinePerServing_mg: 0, sugarPerServing_g: 7 },
	// Alcohol (negative hydration = dehydrating)
	{ id: 'beer', name: 'Beer', category: 'alcohol', hydrationFactor: -0.3, caffeinePerServing_mg: 0, sugarPerServing_g: 13 },
	{ id: 'light_beer', name: 'Light Beer', category: 'alcohol', hydrationFactor: -0.1, caffeinePerServing_mg: 0, sugarPerServing_g: 6 },
	{ id: 'wine', name: 'Wine', category: 'alcohol', hydrationFactor: -0.5, caffeinePerServing_mg: 0, sugarPerServing_g: 1 },
	{ id: 'spirits', name: 'Spirits / Liquor', category: 'alcohol', hydrationFactor: -1.0, caffeinePerServing_mg: 0, sugarPerServing_g: 0 },
	{ id: 'cocktail', name: 'Cocktail', category: 'alcohol', hydrationFactor: -0.4, caffeinePerServing_mg: 0, sugarPerServing_g: 20 },
	{ id: 'hard_seltzer', name: 'Hard Seltzer', category: 'alcohol', hydrationFactor: -0.2, caffeinePerServing_mg: 0, sugarPerServing_g: 2 },
	// Milk (continued)
	{ id: 'flavored_kefir', name: 'Flavored Kefir', category: 'milk', hydrationFactor: 1.1, caffeinePerServing_mg: 0, sugarPerServing_g: 18 },
	// Smoothie
	{ id: 'fruit_smoothie', name: 'Fruit Smoothie', category: 'smoothie', hydrationFactor: 0.85, caffeinePerServing_mg: 0, sugarPerServing_g: 30 },
	{ id: 'green_smoothie', name: 'Green Smoothie', category: 'smoothie', hydrationFactor: 0.9, caffeinePerServing_mg: 0, sugarPerServing_g: 15 },
	{ id: 'protein_shake', name: 'Protein Shake', category: 'smoothie', hydrationFactor: 0.85, caffeinePerServing_mg: 0, sugarPerServing_g: 8 },
]
