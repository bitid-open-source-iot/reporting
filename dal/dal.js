var Q = require('q');
var db = require('../db/mongo');
var ObjectId = require('mongodb').ObjectId;
var ErrorResponse = require('../lib/error-response').ErrorResponse;

var module = function () {
	var dalReports = {
		errorResponse: {
			'error': {
				'code': 401,
				'message': 'Invalid Credentials',
				'errors': [{
					'reason': 'General Reports Error',
					'message': 'Invalid Credentials',
					'location': 'dalReports',
					'locationType': 'header'
				}]
			},
			'hiddenErrors': []
		},

		add: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid': {
					'auth': {
						'users': args.req.body.users,
						'organizationOnly': args.req.body.organizationOnly
					}
				},
				'type': args.req.body.type,
				'layout': args.req.body.layout,
				'widgets': args.req.body.widgets || [],
				'serverDate': new Date(),
				'description': args.req.body.description
			};

			db.call({
				'params': params,
				'operation': 'insert',
				'collection': 'tblReports'
			})
				.then(result => {
					args.result = result[0];
					deferred.resolve(args);
				}, err => {
					dalReports.errorResponse.error.errors[0].code = err.code || dalReports.errorResponse.error.errors[0].code;
					dalReports.errorResponse.error.errors[0].reason = err.description || 'Add Report Error';
					dalReports.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalReports.errorResponse);
				});

			return deferred.promise;
		},

		get: (args) => {
			var deferred = Q.defer();

			var params = {
				'_id': ObjectId(args.req.body.reportId),
				'bitid.auth.users.email': args.req.body.header.email
			};

			var filter = {};
			if (Array.isArray(args.req.body.filter) && args.req.body.filter.length > 0) {
				filter._id = 0;
				args.req.body.filter.map(f => {
					if (f == 'reportId') {
						filter['_id'] = 1;
					} else if (f == 'role' || f == 'users') {
						filter['bitid.auth.users'] = 1;
					} else if (f == 'organizationOnly') {
						filter['bitid.auth.organizationOnly'] = 1;
					} else {
						filter[f] = 1;
					};
				});
			};

			db.call({
				'filter': filter,
				'params': params,
				'operation': 'find',
				'collection': 'tblReports'
			})
				.then(result => {
					args.result = result[0];
					deferred.resolve(args);
				}, err => {
					dalReports.errorResponse.error.errors[0].code = err.code || dalReports.errorResponse.error.errors[0].code;
					dalReports.errorResponse.error.errors[0].reason = err.description || 'Get Report Error';
					dalReports.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalReports.errorResponse);
				});

			return deferred.promise;
		},

		list: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid.auth.users.email': args.req.body.header.email
			};

			if (typeof (args.req.body.reportId) != 'undefined') {
				if (Array.isArray(args.req.body.reportId) && args.req.body.reportId.length > 0) {
					params._id = {
						$in: args.req.body.reportId.map(id => ObjectId(id))
					};
				} else {
					params._id = ObjectId(args.req.body.reportId);
				};
			};

			if (typeof (args.req.body.description) != 'undefined') {
				params.description = {
					$regex: args.req.body.description
				};
			};

			if (typeof (args.req.body.skip) == 'number') {
				var skip = args.req.body.skip;
			};

			if (typeof (args.req.body.sort) == 'object') {
				var sort = args.req.body.sort;
			};

			if (typeof (args.req.body.limit) == 'number') {
				var limit = args.req.body.limit;
			};

			var filter = {};
			if (Array.isArray(args.req.body.filter) && args.req.body.filter.length > 0) {
				filter._id = 0;
				args.req.body.filter.map(f => {
					if (f == 'reportId') {
						filter['_id'] = 1;
					} else if (f == 'role' || f == 'users') {
						filter['bitid.auth.users'] = 1;
					} else if (f == 'organizationOnly') {
						filter['bitid.auth.organizationOnly'] = 1;
					} else {
						filter[f] = 1;
					};
				});
			};

			db.call({
				'skip': skip,
				'sort': sort,
				'limit': limit,
				'filter': filter,
				'params': params,
				'operation': 'find',
				'collection': 'tblReports'
			})
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, err => {
					dalReports.errorResponse.error.errors[0].code = err.code || dalReports.errorResponse.error.errors[0].code;
					dalReports.errorResponse.error.errors[0].reason = err.description || 'List Reports Error';
					dalReports.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalReports.errorResponse);
				});

			return deferred.promise;
		},

		data: (args) => {
			var deferred = Q.defer();

			db.call({
				'params': args.params,
				'database': args.connector.database,
				'operation': 'aggregate',
				'collection': args.connector.table
			})
				.then(result => {
					args.result = JSON.parse(JSON.stringify(result));
					deferred.resolve(args);
				}, err => {
					dalReports.errorResponse.error.errors[0].code = err.code || dalReports.errorResponse.error.errors[0].code;
					dalReports.errorResponse.error.errors[0].reason = err.description || 'List Reports Error';
					dalReports.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalReports.errorResponse);
				});

			return deferred.promise;
		},

		audit: (args) => {
			var deferred = Q.defer();

			// db.call({
			// 	'params': args.params,
			// 	'database': 'reporting',
			// 	'operation': 'find',
			// 	'collection': 'tblReports'
			// })
			// 	.then(result => {
			// 		var deferred = Q.defer();

			// 		var params = result[0];
			// 		params.reportId = params._id.toString();
			// 		delete params._id;

			// 		deferred.resolve({
			// 			'params': params,
			// 			'database': 'reporting',
			// 			'operation': 'insert',
			// 			'collection': 'tblAuditReports'
			// 		});

			// 		return deferred.promise;
			// 	}, null)
			// 	.then(db.call, null)
			// 	.then(result => {
					deferred.resolve(args);
				// }, err => {
				// 	dalReports.errorResponse.error.errors[0].code = err.code || dalReports.errorResponse.error.errors[0].code;
				// 	dalReports.errorResponse.error.errors[0].reason = err.description || 'Audit Report Error';
				// 	dalReports.errorResponse.hiddenErrors.push(err.error);
				// 	deferred.reject(dalReports.errorResponse);
				// });

			return deferred.promise;
		},

		share: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid.auth.users': {
					$elemMatch: {
						'role': {
							$gte: 4
						},
						'email': args.req.body.header.email
					}
				},
				'bitid.auth.users.email': {
					$ne: args.req.body.email
				},
				'_id': ObjectId(args.req.body.reportId)
			};

			var update = {
				$set: {
					'serverDate': new Date()
				},
				$push: {
					'bitid.auth.users': {
						'role': args.req.body.role,
						'email': args.req.body.email
					}
				}
			};

			db.call({
				'params': params,
				'update': update,
				'operation': 'update',
				'collection': 'tblReports'
			})
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, err => {
					dalReports.errorResponse.error.errors[0].code = err.code || dalReports.errorResponse.error.errors[0].code;
					dalReports.errorResponse.error.errors[0].reason = err.description || 'Share Report Error';
					dalReports.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalReports.errorResponse);
				});
			return deferred.promise;
		},

		update: (args) => {
			var deferred = Q.defer();

			var update = {
				$set: {
					'serverDate': new Date()
				}
			};
			if (typeof (args.req.body.layout) != 'undefined' && args.req.body.layout != null && args.req.body.layout != '') {
				update.$set.layout = args.req.body.layout;
			};
			if (typeof (args.req.body.widgets) != 'undefined' && args.req.body.widgets != null && args.req.body.widgets != '') {
				update.$set.widgets = args.req.body.widgets;
			};
			if (typeof (args.req.body.description) != 'undefined') {
				update.$set.description = args.req.body.description;
			};
			if (typeof (args.req.body.organizationOnly) != 'undefined') {
				update.$set['bitid.auth.organizationOnly'] = args.req.body.organizationOnly;
			};

			var params = {
				'bitid.auth.users': {
					$elemMatch: {
						'role': {
							$gte: 2
						},
						'email': args.req.body.header.email
					}
				},
				'_id': ObjectId(args.req.body.reportId)
			};

			dalReports.audit({
				'params': params,
				'update': update,
				'operation': 'update',
				'collection': 'tblReports'
			})
				.then(db.call, null)
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, err => {
					dalReports.errorResponse.error.errors[0].code = err.code || dalReports.errorResponse.error.errors[0].code;
					dalReports.errorResponse.error.errors[0].reason = err.description || 'Update Report Error';
					dalReports.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalReports.errorResponse);
				});

			return deferred.promise;
		},

		delete: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid.auth.users': {
					$elemMatch: {
						'role': {
							$gte: 4
						},
						'email': args.req.body.header.email
					}
				},
				'_id': ObjectId(args.req.body.reportId)
			};

			dalReports.audit({
				'params': params,
				'operation': 'remove',
				'collection': 'tblReports'
			})
				.then(db.call, null)
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, err => {
					dalReports.errorResponse.error.errors[0].code = err.code || dalReports.errorResponse.error.errors[0].code;
					dalReports.errorResponse.error.errors[0].reason = err.description || 'Delete Report Error';
					dalReports.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalReports.errorResponse);
				});

			return deferred.promise;
		},

		unsubscribe: (args) => {
			var deferred = Q.defer();

			var params = {
				'_id': ObjectId(args.req.body.reportId),
				'bitid.auth.users.email': args.req.body.header.email
			};

			db.call({
				'filter': {},
				'params': params,
				'operation': 'find',
				'collection': 'tblReports'
			})
				.then(result => {
					var deferred = Q.defer();

					var role = 0;
					var unsubscribe = true;
					if (args.req.body.email == args.req.body.header.email) {
						result[0].bitid.auth.users.map(user => {
							if (user.email == args.req.body.header.email) {
								if (user.role == 5) {
									role = 5;
									unsubscribe = false;
								};
							};
						});
					} else {
						result[0].bitid.auth.users.map(user => {
							if (user.email == args.req.body.header.email) {
								if (user.role < 4) {
									role = user.role;
									unsubscribe = false;
								};
							};
						});
					};

					if (unsubscribe) {
						var params = {
							'_id': result[0]._id
						};
						var update = {
							$set: {
								'serverDate': new Date()
							},
							$pull: {
								'bitid.auth.users': {
									'email': args.req.body.email
								}
							}
						};
						deferred.resolve({
							'params': params,
							'update': update,
							'operation': 'update',
							'collection': 'tblReports'
						});
					} else {
						var err = new ErrorResponse();
						err.error.code = 401;
						err.error.errors[0].code = 401;
						if (role == 5) {
							err.error.errors[0].reason = 'You are the owner, you may not unsubscribe yourself!';
							err.error.errors[0].message = 'You are the owner, you may not unsubscribe yourself!';
						} else {
							err.error.errors[0].reason = 'You may not unsubscribe others!';
							err.error.errors[0].message = 'You may not unsubscribe others!';
						};
						deferred.reject(err);
					};

					return deferred.promise;
				}, null)
				.then(db.call, null)
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, err => {
					dalReports.errorResponse.error.errors[0].code = err.code || dalReports.errorResponse.error.errors[0].code;
					dalReports.errorResponse.error.errors[0].reason = err.description || 'Unsubscribe User From Report Error';
					dalReports.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalReports.errorResponse);
				});

			return deferred.promise;
		},

		updatesubscriber: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid.auth.users': {
					$elemMatch: {
						'role': {
							$gte: 4
						},
						'email': args.req.body.header.email
					}
				},
				'_id': ObjectId(args.req.body.reportId)
			};

			db.call({
				'params': params,
				'operation': 'find',
				'collection': 'tblReports'
			})
				.then(result => {
					var deferred = Q.defer();

					var params = {
						'_id': ObjectId(args.req.body.reportId),
						'bitid.auth.users.email': args.req.body.email
					};

					var update = {
						$set: {
							'bitid.auth.users.$.role': args.req.body.role
						}
					};

					deferred.resolve({
						'params': params,
						'update': update,
						'operation': 'update',
						'collection': 'tblReports'
					});

					return deferred.promise;
				}, null)
				.then(db.call, null)
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, err => {
					dalReports.errorResponse.error.errors[0].code = err.code || dalReports.errorResponse.error.errors[0].code;
					dalReports.errorResponse.error.errors[0].reason = err.description || 'Update Report Subscriber Error';
					dalReports.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalReports.errorResponse);
				});

			return deferred.promise;
		}
	};

	var dalSchedule = {
		errorResponse: {
			'error': {
				'code': 401,
				'message': 'Invalid Credentials',
				'errors': [{
					'reason': 'General Schedule Error',
					'message': 'Invalid Credentials',
					'location': 'dalSchedule',
					'locationType': 'header'
				}]
			},
			'hiddenErrors': []
		},

		add: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid': {
					'auth': {
						'users': args.req.body.users,
						'organizationOnly': args.req.body.organizationOnly
					}
				},
				'trigger': {
					'hour': args.req.body.trigger.hour,
					'date': args.req.body.trigger.date,
					'year': args.req.body.trigger.year,
					'month': args.req.body.trigger.month,
					'minute': args.req.body.trigger.minute
				},
				'last': null,
				'cycle': args.req.body.cycle,
				'offset': args.req.body.offset,
				'reportId': args.req.body.reportId,
				'recipients': args.req.body.recipients || []
			};

			db.call({
				'params': params,
				'operation': 'insert',
				'collection': 'tblSchedule'
			})
				.then(result => {
					args.result = result[0];
					deferred.resolve(args);
				}, err => {
					dalSchedule.errorResponse.error.errors[0].code = err.code || dalSchedule.errorResponse.error.errors[0].code;
					dalSchedule.errorResponse.error.errors[0].reason = err.description || 'Add Schedule Error';
					dalSchedule.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalSchedule.errorResponse);
				});

			return deferred.promise;
		},

		get: (args) => {
			var deferred = Q.defer();

			var params = {
				'_id': ObjectId(args.req.body.scheduleId),
				'bitid.auth.users.email': args.req.body.header.email
			};

			var filter = {};
			if (Array.isArray(args.req.body.filter) && args.req.body.filter.length > 0) {
				filter._id = 0;
				args.req.body.filter.map(f => {
					if (f == 'scheduleId') {
						filter['_id'] = 1;
					} else if (f == 'role' || f == 'users') {
						filter['bitid.auth.users'] = 1;
					} else if (f == 'organizationOnly') {
						filter['bitid.auth.organizationOnly'] = 1;
					} else {
						filter[f] = 1;
					};
				});
			};

			db.call({
				'filter': filter,
				'params': params,
				'operation': 'find',
				'collection': 'tblSchedule'
			})
				.then(result => {
					args.result = result[0];
					deferred.resolve(args);
				}, err => {
					dalSchedule.errorResponse.error.errors[0].code = err.code || dalSchedule.errorResponse.error.errors[0].code;
					dalSchedule.errorResponse.error.errors[0].reason = err.description || 'Get Schedule Error';
					dalSchedule.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalSchedule.errorResponse);
				});

			return deferred.promise;
		},

		list: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid.auth.users.email': args.req.body.header.email
			};

			if (typeof (args.req.body.scheduleId) != 'undefined') {
				if (Array.isArray(args.req.body.scheduleId) && args.req.body.scheduleId.length > 0) {
					params._id = {
						$in: args.req.body.scheduleId.map(id => ObjectId(id))
					};
				} else {
					params._id = ObjectId(args.req.body.scheduleId);
				};
			};

			if (typeof (args.req.body.description) != 'undefined') {
				params.description = {
					$regex: args.req.body.description
				};
			};

			if (typeof (args.req.body.skip) == 'number') {
				var skip = args.req.body.skip;
			};

			if (typeof (args.req.body.sort) == 'object') {
				var sort = args.req.body.sort;
			};

			if (typeof (args.req.body.limit) == 'number') {
				var limit = args.req.body.limit;
			};

			var filter = {};
			if (Array.isArray(args.req.body.filter) && args.req.body.filter.length > 0) {
				filter._id = 0;
				args.req.body.filter.map(f => {
					if (f == 'scheduleId') {
						filter['_id'] = 1;
					} else if (f == 'role' || f == 'users') {
						filter['bitid.auth.users'] = 1;
					} else if (f == 'organizationOnly') {
						filter['bitid.auth.organizationOnly'] = 1;
					} else {
						filter[f] = 1;
					};
				});
			};

			db.call({
				'skip': skip,
				'sort': sort,
				'limit': limit,
				'filter': filter,
				'params': params,
				'operation': 'find',
				'collection': 'tblSchedule'
			})
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, err => {
					dalSchedule.errorResponse.error.errors[0].code = err.code || dalSchedule.errorResponse.error.errors[0].code;
					dalSchedule.errorResponse.error.errors[0].reason = err.description || 'List Schedules Error';
					dalSchedule.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalSchedule.errorResponse);
				});

			return deferred.promise;
		},

		audit: (args) => {
			var deferred = Q.defer();

			db.call({
				'params': args.params,
				'operation': 'find',
				'collection': 'tblSchedule'
			})
				.then(result => {
					var deferred = Q.defer();

					var params = result[0];
					params.scheduleId = params._id.toString();
					delete params._id;

					deferred.resolve({
						'params': params,
						'operation': 'insert',
						'collection': 'tblAuditReports'
					});

					return deferred.promise;
				}, null)
				.then(db.call, null)
				.then(result => {
					deferred.resolve(args);
				}, err => {
					dalSchedule.errorResponse.error.errors[0].code = err.code || dalSchedule.errorResponse.error.errors[0].code;
					dalSchedule.errorResponse.error.errors[0].reason = err.description || 'Audit Schedule Error';
					dalSchedule.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalSchedule.errorResponse);
				});

			return deferred.promise;
		},

		share: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid.auth.users': {
					$elemMatch: {
						'role': {
							$gte: 4
						},
						'email': args.req.body.header.email
					}
				},
				'bitid.auth.users.email': {
					$ne: args.req.body.email
				},
				'_id': ObjectId(args.req.body.scheduleId)
			};

			var update = {
				$set: {
					'serverDate': new Date()
				},
				$push: {
					'bitid.auth.users': {
						'role': args.req.body.role,
						'email': args.req.body.email
					}
				}
			};

			db.call({
				'params': params,
				'update': update,
				'operation': 'update',
				'collection': 'tblSchedule'
			})
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, err => {
					dalSchedule.errorResponse.error.errors[0].code = err.code || dalSchedule.errorResponse.error.errors[0].code;
					dalSchedule.errorResponse.error.errors[0].reason = err.description || 'Share Schedule Error';
					dalSchedule.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalSchedule.errorResponse);
				});
			return deferred.promise;
		},

		check: (args) => {
			var deferred = Q.defer();

			var params = {
				'next': {
					$gte: new Date(),
					$lte: new Date() + 60000
				}
			};

			db.call({
				'params': params,
				'operation': 'find',
				'collection': 'tblSchedule'
			})
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, err => {
					dalSchedule.errorResponse.error.errors[0].code = err.code || dalSchedule.errorResponse.error.errors[0].code;
					dalSchedule.errorResponse.error.errors[0].reason = err.description || 'Unsubscribe User From Schedule Error';
					dalSchedule.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalSchedule.errorResponse);
				});

			return deferred.promise;
		},

		update: (args) => {
			var deferred = Q.defer();

			var update = {
				$set: {
					'serverDate': new Date()
				}
			};
			if (typeof (args.req.body.url) != 'undefined') {
				update.$set.url = args.req.body.url;
			};
			if (typeof (args.req.body.type) != 'undefined') {
				update.$set.type = args.req.body.type;
			};
			if (typeof (args.req.body.query) != 'undefined') {
				update.$set.query = args.req.body.query;
			};
			if (typeof (args.req.body.description) != 'undefined') {
				update.$set.description = args.req.body.description;
			};
			if (typeof (args.req.body.organizationOnly) != 'undefined') {
				update.$set['bitid.auth.organizationOnly'] = args.req.body.organizationOnly;
			};

			var params = {
				'bitid.auth.users': {
					$elemMatch: {
						'role': {
							$gte: 2
						},
						'email': args.req.body.header.email
					}
				},
				'_id': ObjectId(args.req.body.scheduleId)
			};

			dalSchedule.audit({
				'params': params,
				'update': update,
				'operation': 'update',
				'collection': 'tblSchedule'
			})
				.then(db.call, null)
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, err => {
					dalSchedule.errorResponse.error.errors[0].code = err.code || dalSchedule.errorResponse.error.errors[0].code;
					dalSchedule.errorResponse.error.errors[0].reason = err.description || 'Update Schedule Error';
					dalSchedule.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalSchedule.errorResponse);
				});

			return deferred.promise;
		},

		delete: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid.auth.users': {
					$elemMatch: {
						'role': {
							$gte: 4
						},
						'email': args.req.body.header.email
					}
				},
				'_id': ObjectId(args.req.body.scheduleId)
			};

			dalSchedule.audit({
				'params': params,
				'operation': 'remove',
				'collection': 'tblSchedule'
			})
				.then(db.call, null)
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, err => {
					dalSchedule.errorResponse.error.errors[0].code = err.code || dalSchedule.errorResponse.error.errors[0].code;
					dalSchedule.errorResponse.error.errors[0].reason = err.description || 'Delete Schedule Error';
					dalSchedule.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalSchedule.errorResponse);
				});

			return deferred.promise;
		},

		unsubscribe: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid.auth.users': {
					$elemMatch: {
						'role': {
							$gte: 4
						},
						'email': args.req.body.header.email
					}
				},
				'_id': ObjectId(args.req.body.scheduleId)
			};
			var update = {
				$set: {
					'serverDate': new Date()
				},
				$pull: {
					'bitid.auth.users': {
						'email': args.req.body.email
					}
				}
			};

			db.call({
				'params': params,
				'update': update,
				'operation': 'update',
				'collection': 'tblSchedule'
			})
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, err => {
					dalSchedule.errorResponse.error.errors[0].code = err.code || dalSchedule.errorResponse.error.errors[0].code;
					dalSchedule.errorResponse.error.errors[0].reason = err.description || 'Unsubscribe User From Schedule Error';
					dalSchedule.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalSchedule.errorResponse);
				});

			return deferred.promise;
		},

		updatesubscriber: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid.auth.users': {
					$elemMatch: {
						'role': {
							$gte: 4
						},
						'email': args.req.body.header.email
					}
				},
				'_id': ObjectId(args.req.body.scheduleId)
			};

			db.call({
				'params': params,
				'operation': 'find',
				'collection': 'tblSchedule'
			})
				.then(result => {
					var deferred = Q.defer();

					var params = {
						'_id': ObjectId(args.req.body.scheduleId),
						'bitid.auth.users.email': args.req.body.email
					};

					var update = {
						$set: {
							'bitid.auth.users.$.role': args.req.body.role
						}
					};

					deferred.resolve({
						'params': params,
						'update': update,
						'operation': 'update',
						'collection': 'tblSchedule'
					});

					return deferred.promise;
				}, null)
				.then(db.call, null)
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, err => {
					dalSchedule.errorResponse.error.errors[0].code = err.code || dalSchedule.errorResponse.error.errors[0].code;
					dalSchedule.errorResponse.error.errors[0].reason = err.description || 'Update Schedule Subscriber Error';
					dalSchedule.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalSchedule.errorResponse);
				});

			return deferred.promise;
		}
	};

	var dalConnectors = {
		errorResponse: {
			'error': {
				'code': 401,
				'message': 'Invalid Credentials',
				'errors': [{
					'reason': 'General Connectors Error',
					'message': 'Invalid Credentials',
					'location': 'dalConnectors',
					'locationType': 'header'
				}]
			},
			'hiddenErrors': []
		},

		get: (args) => {
			var deferred = Q.defer();

			var params = {
				'_id': ObjectId(args.req.body.connectorId)
			};

			var filter = {};
			if (Array.isArray(args.req.body.filter) && args.req.body.filter.length > 0) {
				filter._id = 0;
				args.req.body.filter.map(f => {
					if (f == 'connectorId') {
						filter['_id'] = 1;
					} else {
						filter[f] = 1;
					};
				});
			};

			db.call({
				'filter': filter,
				'params': params,
				'operation': 'find',
				'collection': 'tblConnectors'
			})
				.then(result => {
					args.result = result[0];
					deferred.resolve(args);
				}, err => {
					dalSchedule.errorResponse.error.errors[0].code = err.code || dalSchedule.errorResponse.error.errors[0].code;
					dalSchedule.errorResponse.error.errors[0].reason = err.description || 'Get Schedule Error';
					dalSchedule.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalSchedule.errorResponse);
				});

			return deferred.promise;
		},

		list: (args) => {
			var deferred = Q.defer();

			var params = {};

			if (typeof (args.req.body.connectorId) != 'undefined') {
				if (Array.isArray(args.req.body.connectorId) && args.req.body.connectorId.length > 0) {
					params._id = {
						$in: args.req.body.connectorId.map(id => ObjectId(id))
					};
				} else {
					params._id = ObjectId(args.req.body.connectorId);
				};
			};

			if (typeof (args.req.body.description) != 'undefined') {
				params.description = {
					$regex: args.req.body.description
				};
			};

			var filter = {};
			if (Array.isArray(args.req.body.filter) && args.req.body.filter.length > 0) {
				filter._id = 0;
				args.req.body.filter.map(f => {
					if (f == 'connectorId') {
						filter['_id'] = 1;
					} else {
						filter[f] = 1;
					};
				});
			};

			db.call({
				'filter': filter,
				'params': params,
				'operation': 'find',
				'collection': 'tblConnectors'
			})
				.then(result => {
					args.result = result;
					deferred.resolve(args);
				}, err => {
					dalSchedule.errorResponse.error.errors[0].code = err.code || dalSchedule.errorResponse.error.errors[0].code;
					dalSchedule.errorResponse.error.errors[0].reason = err.description || 'List Schedules Error';
					dalSchedule.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalSchedule.errorResponse);
				});

			return deferred.promise;
		},

		load: (args) => {
			var deferred = Q.defer();

			var params = {
				'_id': ObjectId(args.req.body.connectorId)
			};

			db.call({
				'params': params,
				'operation': 'find',
				'collection': 'tblConnectors'
			})
				.then(result => {
					args.connector = JSON.parse(JSON.stringify(result[0]));
					deferred.resolve(args);
				}, err => {
					dalReports.errorResponse.error.errors[0].code = err.code || dalReports.errorResponse.error.errors[0].code;
					dalReports.errorResponse.error.errors[0].reason = err.description || 'List Reports Error';
					dalReports.errorResponse.hiddenErrors.push(err.error);
					deferred.reject(dalReports.errorResponse);
				});

			return deferred.promise;
		},

		authenticate: (args) => {
			var deferred = Q.defer();

			var params = {
				'bitid.auth.users.email': args.req.body.header.email
			};

			var field = args.connector.authenticate.field;

			if (typeof(args.req.body[field]) != 'undefined' && args.req.body[field] != null && args.req.body[field] != '') {
				if (Array.isArray(args.req.body[field]) && args.req.body[field].length > 0) {
					params._id = {
						$in: args.req.body[field].map(id => ObjectId(id))
					};
				} else if (typeof(args.req.body[field]) == 'string' && args.req.body[field].length == 24) {
					params._id = ObjectId(args.req.body[field]);
				};
			};

			db.call({
				'params': params,
				'database': args.connector.database,
				'operation': 'find',
				'collection': args.connector.authenticate.table
			})
				.then(result => {
					args.req.body[field] = JSON.parse(JSON.stringify(result)).map(o => o._id);
					deferred.resolve(args);
				}, error => {
					var err = new ErrorResponse();
					err.error.errors[0].code = 503;
					err.error.errors[0].reason = error.description;
					err.error.errors[0].message = 'Authentication table rejected query!';
					deferred.reject(err);
				});

			return deferred.promise;
		}
	};

	return {
		'reports': dalReports,
		'schedule': dalSchedule,
		'connectors': dalConnectors
	};
};

exports.module = module;