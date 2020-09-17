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
								console.log("QUERY: ", args.params);
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
									args.result.sort((a, b) => {
										b.value = b.value - a.value
										result.push(b);
										return 0;
									});
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
										args.result = args.result.map(o => o.value);
										var max = 0;
										switch (args.req.body.query.range) {
											case ('current-day'):
											case ('previous-day'):
												max = 24;
												break;
											case ('current-week'):
											case ('previous-week'):
												max = 7;
												break;
											case ('current-month'):
												max = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
												break;
											case ('previous-month'):
												max = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0).getDate();
												break;
											case ('current-year'):
											case ('previous-year'):
												max = 12;
												break;
										};
										if (args.req.body.query.counter) {
											var step = args.result[0];
											var total = args.result.map(value => {
												var tmp = value - step;
												step = value;
												return tmp;
											}).reduce((a, b) => a + b);
											var average = total / args.result.length;
											args.result = average * max;
											args.result = parseFloat(average * max.toFixed(2));
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