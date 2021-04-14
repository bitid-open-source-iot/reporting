const Q = require('q');
const ErrorResponse = require('./error-response');

var module = function () {
	var responder = {
		response: {
			update(result) {
				var deferred = Q.defer();

				deferred.resolve({
					'updated': result.n
				});

				return deferred.promise;
			},

			delete(result) {
				var deferred = Q.defer();

				deferred.resolve({
					'deleted': result.n
				});

				return deferred.promise;
			},

			reports: {
				add(result) {
					var deferred = Q.defer();

					deferred.resolve({
						'reportId': result._id
					});

					return deferred.promise;
				},

				get(result) {
					var deferred = Q.defer();

					var tmp = {
						'role': result.role,
						'views': result.views,
						'layout': result.layout,
						'reportId': result._id,
						'settings': result.settings,
						'serverDate': result.serverDate,
						'description': result.description
					};

					if (typeof (result.bitid) != "undefined") {
						if (typeof (result.bitid.auth) != "undefined") {
							tmp.users = result.bitid.auth.users;
							tmp.organizationOnly = result.bitid.auth.organizationOnly;
						};
					};

					deferred.resolve(tmp);

					return deferred.promise;
				},

				list(result) {
					var deferred = Q.defer();

					result = result.map(obj => {
						var tmp = {
							'role': obj.role,
							'views': obj.views,
							'layout': obj.layout,
							'reportId': obj._id,
							'settings': obj.settings,
							'serverDate': obj.serverDate,
							'description': obj.description
						};

						if (typeof (obj.bitid) != "undefined") {
							if (typeof (obj.bitid.auth) != "undefined") {
								tmp.users = obj.bitid.auth.users;
								tmp.organizationOnly = obj.bitid.auth.organizationOnly;
							};
						};

						return tmp;
					});

					deferred.resolve(result);

					return deferred.promise;
				},

				data(result) {
					var deferred = Q.defer();

					result = result.map(obj => {
						return {
							'id': obj.id,
							'type': obj.type,
							'result': obj.result,
							'analog': obj.analog,
							'digital': obj.digital
						};
					});

					deferred.resolve(result);

					return deferred.promise;
				}
			},

			connectors: {
				get: (result) => {
					var deferred = Q.defer();

					deferred.resolve({
						'table': result.table,
						'fields': result.fields,
						'database': result.database,
						'serverDate': result.serverDate,
						'connectorId': result._id,
						'description': result.description
					});

					return deferred.promise;
				},

				list: (result) => {
					var deferred = Q.defer();

					result = result.map(obj => {
						return {
							'table': obj.table,
							'fields': obj.fields,
							'database': obj.database,
							'serverDate': obj.serverDate,
							'connectorId': obj._id,
							'description': obj.description
						};
					});

					deferred.resolve(result);

					return deferred.promise;
				}
			}
		},

		model: (req, result) => {
			var deferred = Q.defer();

			switch (req.originalUrl) {
				case ('*'):
					deferred.resolve(result);
					break;

				case ('/reporting/reports/add'):
					responder.response.reports.add(result).then(deferred.resolve, deferred.reject);
					break;
				case ('/reporting/reports/get'):
					responder.response.reports.get(result).then(deferred.resolve, deferred.reject);
					break;
				case ('/reporting/reports/list'):
					responder.response.reports.list(result).then(deferred.resolve, deferred.reject);
					break;
				case ('/reporting/reports/data'):
					responder.response.reports.data(result).then(deferred.resolve, deferred.reject);
					break;

				case ('/reporting/connectors/get'):
					responder.response.connectors.get(result).then(deferred.resolve, deferred.reject);
					break;
				case ('/reporting/connectors/list'):
					responder.response.connectors.list(result).then(deferred.resolve, deferred.reject);
					break;

				case ('/reporting/reports/share'):
				case ('/reporting/reports/update'):
				case ('/reporting/reports/unsubscribe'):
				case ('/reporting/reports/change-owner'):
				case ('/reporting/reports/update-subscriber'):
					responder.response.update(result).then(deferred.resolve, deferred.reject);
					break;

				case ('/reporting/reports/delete'):
					responder.response.delete(result).then(deferred.resolve, deferred.reject);
					break;

				default:
					deferred.resolve({
						'success': 'Your request resolved successfully but this payload is not modeled!'
					});
					break;
			};

			return deferred.promise;
		},

		error: (req, res, err) => {
			if (typeof (err) == 'object') {
				try {
					__logger.error(JSON.stringify(err));
				} catch (e) {
					__logger.error('Skipped writing an Error. Could not stringify the err object');
				};
			} else {
				__logger.error(err);
			};

			res.status(err.error.code).json(err.error);
		},

		success: (req, res, result) => {
			responder.model(req, result)
				.then(result => {
					res.json(result);
				}, error => {
					var err = new ErrorResponse()
					err.error.errors[0].code = 401;
					err.error.errors[0].reason = error.message;
					err.error.errors[0].message = error.message;
					responder.error(req, res, err);
				});
		}
	};

	return responder;
};

exports.module = module;