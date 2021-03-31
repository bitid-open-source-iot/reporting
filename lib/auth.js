const Q = require('q');
const fetch = require('node-fetch');
const ErrorResponse = require('./error-response');

exports.authenticate = async (args) => {
	var deferred = Q.defer();

	try {
		const url = [__settings.auth.host, '/auth/validate'].join('');
		const payload = JSON.stringify({
			'header': {
				'email': args.req.body.header.email,
				'appId': args.req.body.header.appId
			},
			'scope': args.req.originalUrl
		});
		const response = await fetch(url, {
			'headers': {
				'Accept': '*/*',
				'Content-Type': 'application/json; charset=utf-8',
				'Authorization': args.req.headers.authorization,
				'Content-Length': payload.length
			},
			'body': payload,
			'method': "PUT"
		});

		const result = await response.json();

		if (response.ok) {
			deferred.resolve(args);
		} else {
			deferred.reject({
				error: result
			});
		};
	} catch (error) {
		var err = new ErrorResponse();
		err.error.code = 401;
		err.error.errors[0].code = 401;
		err.error.errors[0].reason = error.message;
		err.error.errors[0].message = "Issue Authenticating User";
		deferred.reject(err);
	};

	return deferred.promise;
};