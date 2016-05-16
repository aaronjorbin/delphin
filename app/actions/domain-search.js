// Internal dependencies
import { addNotice } from 'actions/notices';
import {
	WPCOM_REQUEST,
	DOMAIN_SELECT,
	DOMAIN_SUGGESTIONS_CLEAR,
	DOMAIN_SUGGESTIONS_FETCH,
	DOMAIN_SUGGESTIONS_FETCH_COMPLETE,
	DOMAIN_SUGGESTIONS_FETCH_FAIL
} from 'reducers/action-types';

/**
 * Returns an action object to be used in signalling that domain suggestions have been cleared.
 *
 * @returns {Object} the corresponding action object
 */
export function clearDomainSuggestions() {
	return {
		type: DOMAIN_SUGGESTIONS_CLEAR
	};
}

export function fetchDomainSuggestions( domainQuery ) {
	if ( domainQuery.trim() === '' ) {
		return clearDomainSuggestions();
	}

	return {
		type: WPCOM_REQUEST,
		method: 'get',
		params: { path: '/domains/suggestions' },
		query: {
			query: domainQuery,
			quantity: 36,
			include_wordpressdotcom: false,
			vendor: 'domainsbot',
			tlds: [ 'live' ]
		},
		loading: DOMAIN_SUGGESTIONS_FETCH,
		success: ( results ) => ( { type: DOMAIN_SUGGESTIONS_FETCH_COMPLETE, results } ),
		fail: ( error ) => {
			return dispatch => {
				dispatch( {
					type: DOMAIN_SUGGESTIONS_FETCH_FAIL
				} );
				dispatch( addNotice( {
					message: error.message,
					status: 'error'
				} ) );
			};
		}
	};
}

export function selectDomain( domain ) {
	return {
		type: DOMAIN_SELECT,
		domain
	};
}
