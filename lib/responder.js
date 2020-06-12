var Q = require('q');

var module = function() {
	var responder = {
		errorObject: {
			"error": {
				"code": 	401,
				"message": "API Responder Error",
				"errors":[{
					"code": 	 	1,
					"reason": 	 	"General Error",
					"message": 	 	"Error In API Responder",
					"locaction": 	"Responder",
					"locationType": "db"
				}]
			}
		},

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
					var deferred 	= Q.defer();

					var tmp = {
						'url': 			result.url,
						'role': 		result.role,
						'type': 		result.type,
						'query': 		result.query,
						'reportId': 	result._id,
						'serverDate': 	result.serverDate,
						'description': 	result.description
					};
					
					if (typeof(result.bitid) != "undefined") {
						if (typeof(result.bitid.auth) != "undefined") {
							tmp.users 				= result.bitid.auth.users;
							tmp.organizationOnly 	= result.bitid.auth.organizationOnly;
						};
					};

					deferred.resolve(tmp);
					
					return deferred.promise;
				},

				list(result) {
					var deferred 	= Q.defer();

					result = result.map(obj => {
						var tmp = {
							'url': 			obj.url,
							'role': 		obj.role,
							'type': 		obj.type,
							'query': 		obj.query,
							'reportId': 	obj._id,
							'serverDate': 	obj.serverDate,
							'description': 	obj.description
						};
						
						if (typeof(obj.bitid) != "undefined") {
							if (typeof(obj.bitid.auth) != "undefined") {
								tmp.users 				= obj.bitid.auth.users;
								tmp.organizationOnly 	= obj.bitid.auth.organizationOnly;
							};
						};

						return tmp;
					});

					deferred.resolve(result);
					
					return deferred.promise;
				}
			}
		},

		model: (req, result) => {
			var deferred = Q.defer();

			switch(req.originalUrl) {
				case('*'):
					deferred.resolve(result);
					break;

				case('/reporting/reports/add'):
					responder.response.reports.add(result).then(deferred.resolve, deferred.reject);
					break;
				case('/reporting/reports/get'):
					responder.response.reports.get(result).then(deferred.resolve, deferred.reject);
					break;
				case('/reporting/reports/list'):
					responder.response.reports.list(result).then(deferred.resolve, deferred.reject);
					break;

				case('/reporting/reports/share'):
				case('/reporting/reports/update'):
				case('/reporting/reports/unsubscribe'):
				case('/reporting/reports/updatesubscriber'):
					responder.response.update(result).then(deferred.resolve, deferred.reject);
					break;

				case('/reporting/reports/delete'):
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
			if (typeof(err) == 'object') {
				try {
					__logger.LogData(JSON.stringify(err),'');
				} catch(e) {
					__logger.LogData('Skipped writing an Error. Could not stringify the err object','');
				};
			} else {
				__logger.LogData(err,'');	
			};
			
			res.status(err.error.code).json(err.error);
		},

		success: (req, res, result) => {
			responder.model(req, result)
			.then(result => {
				if (typeof(result[0]) !== 'undefined') {
					if (typeof(result[0].error) !== 'undefined') {
						if (result[0].error == 'No records found') {
							responder.errorObject.error.code 	= 401;
							responder.errorObject.error.message = 'No records found1';
						};

						responder.errorResponse(req, res, responder.errorObject);
						
						return;				
					};
				};
				res.json(result);
			},  err => {
				responder.errorObject.error.code 	= 401;
				responder.errorObject.error.message = err;
				responder.errorResponse(req, res, responder.errorObject);
			});
		}
	};

	return responder;
};

exports.module = module;