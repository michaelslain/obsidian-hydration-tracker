import { h } from 'preact'
import { useState } from 'preact/hooks'
import { HydrationStore } from '../HydrationStore'
import { DashboardView } from './DashboardView'
import { AddDrinkModal } from './AddDrinkModal'
import { ManageDrinksModal } from './ManageDrinksModal'

interface AppProps {
	store: HydrationStore
}

export function App({ store }: AppProps) {
	const [showAdd, setShowAdd] = useState(false)
	const [showManage, setShowManage] = useState(false)

	return (
		<div class="ht-app">
			<DashboardView
				store={store}
				onAddDrink={() => setShowAdd(true)}
				onManageDrinks={() => setShowManage(true)}
			/>
			{showAdd && (
				<AddDrinkModal
					store={store}
					onClose={() => setShowAdd(false)}
				/>
			)}
			{showManage && (
				<ManageDrinksModal
					store={store}
					onClose={() => setShowManage(false)}
				/>
			)}
		</div>
	)
}
