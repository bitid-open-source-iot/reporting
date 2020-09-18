var Q = require('q');
var tools = require('../lib/tools');
var telemetry = require('../lib/telemetry');
var dalModule = require('../dal/dal');
var ErrorResponse = require('../lib/error-response').ErrorResponse;

var module = function () {
	var bllReports = {
		errorResponse: {
			"error": {
				"code": 401,
				"message": "Reports Error",
				"errors": [{
					"reason": "General Reports Error",
					"message": "Reports Error",
					"location": "bllReports",
					"locationType": "body"
				}]
			},
			"hiddenErrors": []
		},

		add: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			tools.insertOwnerIfNoneExists(args)
				.then(dal.reports.add, null)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		get: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.reports.get(args)
				.then(tools.setRoleObject, null)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		list: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.reports.list(args)
				.then(tools.setRoleList, null)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		data: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.connectors.load(args)
				.then(dal.connectors.authenticate, null)
				.then(args => {
					var deferred = Q.defer();

					try {
						var err = new ErrorResponse();
						err.error.errors[0].code = 503;
						err.error.errors[0].reason = "Display type not found!";
						err.error.errors[0].message = "Display type not found!";
						switch (args.req.body.type) {
							case ('map'):
								break;
							case ('chart'):
								args.params = telemetry.historical.inputs.data(args.req.body.query);
								deferred.resolve(args);
								break;
							case ('table'):
								break;
							case ('value'):
								switch (args.req.body.value.expression) {
									case ('last-value'):
										args.params = telemetry.historical.inputs.value.last(args.req.body.query);
										deferred.resolve(args);
										break;
									case ('first-value'):
										args.params = telemetry.historical.inputs.value.first(args.req.body.query);
										deferred.resolve(args);
										break;
									case ('predicted-value'):
										args.params = telemetry.historical.inputs.value.predict(args.req.body.query);
										deferred.resolve(args);
										break;
									default:
										var err = new ErrorResponse();
										err.error.errors[0].code = 503;
										err.error.errors[0].reason = "Value expression not found!";
										err.error.errors[0].message = "Value expression not found!";
										deferred.reject(err);
										break;
								};
								break;
							default:
								deferred.reject(err);
								break;
						};
					} catch (error) {
						var err = new ErrorResponse();
						err.error.errors[0].code = 503;
						err.error.errors[0].reason = error.message;
						err.error.errors[0].message = error.message;
						deferred.reject(err);
					};

					return deferred.promise;
				}, null)
				.then(dal.reports.data, null)
				.then(args => {
					var deferred = Q.defer();

					try {
						switch (args.req.body.type) {
							case ('map'):
								break;
							case ('chart'):
								if (args.req.body.query.counter) {
									var result = [];
									for (let i = 0; i < args.result.length; i++) {
										if (i + 1 < args.result.length) {
											const value = (args.result[i + 1].value - args.result[i].value);
											result.push({
												'date': args.result[i].date,
												'value': value
											});
										};
									};
									args.result = result;
								};
								break;
							case ('table'):
								break;
							case ('value'):
								switch (args.req.body.value.expression) {
									case ('last-value'):
									case ('first-value'):
										args.result = parseFloat(args.result[0].value.toFixed(2));
										break;
									case ('predicted-value'):
										if (args.req.body.query.counter) {
											try {
												var result = [];
												for (let i = 0; i < args.result.length; i++) {
													if (i + 1 < args.result.length) {
														result.push(args.result[i + 1].value - args.result[i].value);
													};
												};
												args.req.body.query.date.to = new Date(args.req.body.query.date.to);
												args.req.body.query.date.from = new Date(args.req.body.query.date.from);
												
												var max = 0;
												var gap = args.req.body.query.date.to - args.req.body.query.date.from;
												var days = new Date(args.req.body.query.date.to.getFullYear(), args.req.body.query.date.to.getMonth() + 1, 0).getDate();
												var total = result.reduce((a, b) => a + b);
												var average = total / result.length;
			
												if (gap > 0 && gap <= (60 * 60 * 1000)) { /* --- HOUR --- */
													max = 60;
												} else if (gap > (60 * 60 * 1000) && gap <= (24 * 60 * 60 * 1000)) { /* --- DAY --- */
													max = 24;
												} else if (gap > (24 * 60 * 60 * 1000) && gap <= (days * 7 * 24 * 60 * 60 * 1000)) { /* --- MONTH --- */
													max = new Date(args.req.body.query.date.to.getFullYear(), args.req.body.query.date.to.getMonth() + 1, 0).getDate();
												} else { /* --- YEAR --- */
													max = 12;
												};
												
												args.result = average * max;
											} catch (error) {
												console.log(error.message);
											};
										} else {
											var total = args.result.reduce((a, b) => a + b);
											var average = total / args.result.length;
											args.result = parseFloat(average.toFixed(2));
										};
										break;
								};
								break;
						};

						deferred.resolve(args);
					} catch (error) {
						var err = new ErrorResponse();
						err.error.errors[0].code = 503;
						err.error.errors[0].reason = error.message;
						err.error.errors[0].message = error.message;
						deferred.reject(err);
					};

					return deferred.promise;
				}, null)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		share: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.reports.share(args)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		update: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.reports.update(args)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		delete: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.reports.delete(args)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		unsubscribe: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.reports.unsubscribe(args)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		updatesubscriber: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.reports.updatesubscriber(args)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		}
	};

	var bllSchedule = {
		errorResponse: {
			"error": {
				"code": 401,
				"message": "Schedule Error",
				"errors": [{
					"reason": "General Schedule Error",
					"message": "Schedule Error",
					"location": "bllSchedule",
					"locationType": "body"
				}]
			},
			"hiddenErrors": []
		},

		add: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			tools.insertOwnerIfNoneExists(args)
				.then(dal.schedule.add, null)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		get: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.schedule.get(args)
				.then(tools.setRoleObject, null)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		list: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.schedule.list(args)
				.then(tools.setRoleList, null)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		share: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.schedule.share(args)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		update: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.schedule.update(args)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		delete: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.schedule.delete(args)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		unsubscribe: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.schedule.unsubscribe(args)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		updatesubscriber: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.schedule.updatesubscriber(args)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		}
	};

	var bllConnectors = {
		errorResponse: {
			"error": {
				"code": 401,
				"message": "Connectors Error",
				"errors": [{
					"reason": "General Connectors Error",
					"message": "Connectors Error",
					"location": "bllConnectors",
					"locationType": "body"
				}]
			},
			"hiddenErrors": []
		},

		get: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.connectors.get(args)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		list: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.connectors.list(args)
				.then(args => {
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		}
	};

	return {
		'reports': bllReports,
		'schedule': bllSchedule,
		'connectors': bllConnectors
	};
};

exports.module = module;