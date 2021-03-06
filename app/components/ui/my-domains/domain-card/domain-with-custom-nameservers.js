// External dependencies
import { bindHandlers } from 'react-bind-handlers';
import classNames from 'classnames';
import i18n from 'i18n-calypso';
import { Link } from 'react-router';
import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// Internal dependencies
import { getPath } from 'routes';
import styles from './styles.scss';

class DomainWithCustomNameservers extends Component {
	handleResetDomain( event ) {
		event.preventDefault();

		const {
			domainName,
			resetDomain,
			recordTracksEvent,
		} = this.props;

		recordTracksEvent( 'delphin_reset_name_servers_click', { domain_name: domainName } );

		resetDomain( domainName, 'sawbuck' );
	}

	render() {
		const {
			domainName
		} = this.props;

		return (
			<div className={ classNames( styles.domainCard, styles.connectedNameservers ) }>
				<div className={ styles.domainHeading }>
					<h3>{ domainName }</h3>
				</div>
				<div className={ styles.domainDetails }>
					<p>{ i18n.translate( 'This domain has custom name servers.' ) }</p>
				</div>
				<div className={ styles.domainCardFooter }>
					<Link
						to={ getPath( 'updateNameservers', { domainName } ) }
					>{ i18n.translate( 'Edit name servers' ) }</Link>
					<a
						href="#"
						className={ styles.resetSettings }
						onClick={ this.handleResetDomain }
					>{ i18n.translate( 'Revert to default name servers' ) }</a>
				</div>
			</div>
		);
	}
}

DomainWithCustomNameservers.propTypes = {
	domainName: PropTypes.string.isRequired,
	recordTracksEvent: PropTypes.func.isRequired,
	resetDomain: PropTypes.func.isRequired,
};

export default withStyles( styles )( bindHandlers( DomainWithCustomNameservers ) );
