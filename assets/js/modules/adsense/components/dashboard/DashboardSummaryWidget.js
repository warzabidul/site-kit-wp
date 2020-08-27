/**
 * DashboardSummaryWidget component.
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
 * External dependencies
 */
import moment from 'moment';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME } from '../../datastore/constants';
import { STORE_NAME as CORE_USER } from '../../../../googlesitekit/datastore/user/constants';
import whenActive from '../../../../util/when-active';
import ErrorText from '../../../../components/error-text';
import PreviewBlock from '../../../../components/preview-block';
const { useSelect } = Data;

function DashboardSummaryWidget() {
	const {
		todayData,
		todayError,
		rangeData,
		rangeError,
		lastMonthData,
		lastMonthError,
	} = useSelect( ( select ) => {
		const store = select( STORE_NAME );
		const metrics = [ 'EARNINGS', 'PAGE_VIEWS_RPM', 'IMPRESSIONS' ];

		const format = 'YYYY-MM-DD';
		const today = moment().format( format );
		const lastMonth = moment().subtract( 1, 'month' ).format( format );

		global.console.log( today, lastMonth );

		const todayArgs = {
			startDate: today,
			endDate: today,
			metrics,
		};

		const rangeArgs = {
			dateRange: select( CORE_USER ).getDateRange(),
			metrics,
		};

		const lastMonthArgs = {
			startDate: lastMonth,
			endDate: today,
			dimensions: [ 'DATE' ],
			metrics,
		};

		return {
			todayData: store.getReport( todayArgs ),
			todayError: store.getErrorForSelector( 'getReport', [ todayArgs ] ),
			rangeData: store.getReport( rangeArgs ),
			rangeError: store.getErrorForSelector( 'getReport', [ rangeArgs ] ),
			lastMonthData: store.getReport( lastMonthArgs ),
			lastMonthError: store.getErrorForSelector( 'getReport', [ lastMonthArgs ] ),
		};
	} );

	if ( todayError || rangeError || lastMonthError ) {
		return (
			<div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
				<ErrorText message={ ( todayError || rangeError || lastMonthError ).message } />
			</div>
		);
	}

	if ( ! todayData || ! rangeData || ! lastMonthData ) {
		return <PreviewBlock width="100%" height="276px" />;
	}

	return 'DashboardSummaryWidget';
}

export default whenActive( { moduleName: 'adsence' } )( DashboardSummaryWidget );
