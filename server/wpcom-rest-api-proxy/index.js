// External dependencies
import express from 'express';
import bodyParser from 'body-parser';
import WPCOM from 'wpcom';

// Internal dependencies
import secrets from 'server/secrets.json';

let wpcomAPI = WPCOM();

module.exports = function wpcomRestApiProxy() {
	const app = express();

	app.get( '/domains/suggestions', function( request, response ) {
		const payload = {
			query: request.query.query,
			quantity: 10,
			include_wordpressdotcom: false
		};

		wpcomAPI.req.get( '/domains/suggestions', payload, function( error, results ) {
			results.pop();
			response.send( results );
		} );
	} );

	app.use( bodyParser.json() ).post( '/users/new', function( request, response ) {
		let payload = request.body;
		payload.client_id = secrets.wordpress_rest_api_client_id;
		payload.client_secret = secrets.wordpress_rest_api_oauth_client_secret;

		wpcomAPI.req.post( '/users/new', payload, function( error, results ) {
			if ( ! error ) {
				wpcomAPI = WPCOM( results.bearer_token );
			}

			response.send( error || results );
		} );
	} );

	app.use( bodyParser.json() ).post( '/sites/new', function( request, response ) {
		let payload = request.body;
		payload.client_id = secrets.wordpress_rest_api_client_id;
		payload.client_secret = secrets.wordpress_rest_api_oauth_client_secret;

		wpcomAPI.req.post( '/sites/new', payload, function( error, results ) {
			response.send( error || results );
		} );
	} );

	app.use( bodyParser.json() ).post( '/me/transactions', function( request, response ) {
		const payload = request.body;
		wpcomAPI.req.post( '/me/transactions', payload, ( error, results ) => {
			response.send( error || results );
		} );
	} );

	return app;
};
