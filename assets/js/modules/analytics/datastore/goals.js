/**
 * modules/analytics data store: goals.
 *
 * Site Kit by Google, Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import API from 'googlesitekit-api';
import Data from 'googlesitekit-data';
import { STORE_NAME } from './constants';
import { createFetchStore } from '../../../googlesitekit/data/create-fetch-store';

const fetchGetGoalsStore = createFetchStore( {
	baseName: 'getGoals',
	controlCallback: () => {
		return API.get( 'modules', 'analytics', 'goals' );
	},
	reducerCallback: ( state, goals ) => {
		return {
			...state,
			goals,
		};
	},
} );

const BASE_INITIAL_STATE = {
	goals: undefined,
};

const baseResolvers = {
	*getGoals() {
		const registry = yield Data.commonActions.getRegistry();
		const existingGoals = registry.select( STORE_NAME ).getGoals();

		// If there are already goals loaded in state, consider it fulfilled
		// and don't make an API request.
		if ( existingGoals ) {
			return;
		}

		yield fetchGetGoalsStore.actions.fetchGetGoals();
	},
};

const baseSelectors = {
	/**
	 * Gets Analytics goals.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object} state Data store's state.
	 * @return {(Array.<Object>|undefined)} An Analytics goals; `undefined` if not loaded.
	 */
	getGoals( state ) {
		const { goals } = state;
		return goals;
	},
};

const store = Data.combineStores(
	fetchGetGoalsStore,
	{
		INITIAL_STATE: BASE_INITIAL_STATE,
		resolvers: baseResolvers,
		selectors: baseSelectors,
	}
);

export const INITIAL_STATE = store.INITIAL_STATE;
export const actions = store.actions;
export const controls = store.controls;
export const reducer = store.reducer;
export const resolvers = store.resolvers;
export const selectors = store.selectors;

export default store;
