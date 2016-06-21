// External dependencies
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

// Internal dependencies
import Hosts from 'components/ui/hosts';
import { getPath } from 'routes';

export default connect(
	null,
	dispatch => ( {
		redirectToHostInfo: ( hostName ) => dispatch( push( { pathname: getPath( 'hostInfo' ) + '/' + hostName } ) )
	} )
)( Hosts );
