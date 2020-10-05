var Q = require('q');
var moment = require('moment');
var tools = require('../lib/tools');
var telemetry = require('../lib/telemetry');
var dalModule = require('../dal/dal');
var ErrorResponse = require('../lib/error-response');

var module = function () {
	var bllReports = {
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
			dal.reports.validate(args)
				.then(args => {
					var deferred = Q.defer();

					try {
						var err = new ErrorResponse();
						err.error.errors[0].code = 503;
						err.error.errors[0].reason = 'Display type not found!';
						err.error.errors[0].message = 'Display type not found!';
						switch (args.req.body.display) {
							case ('map'):
								break;
							case ('chart'):
								args.params = telemetry.historical.inputs.data(args.req.body.query, args.devices);
								deferred.resolve(args);
								break;
							case ('table'):
								break;
							case ('value'):
								switch (args.req.body.value.expression) {
									case ('last-value'):
										args.params = telemetry.historical.inputs.value.last(args.req.body.query, args.devices);
										deferred.resolve(args);
										break;
									case ('first-value'):
										args.params = telemetry.historical.inputs.value.first(args.req.body.query, args.devices);
										deferred.resolve(args);
										break;
									case ('predicted-value'):
										args.params = telemetry.historical.inputs.value.predict(args.req.body.query, args.devices);
										deferred.resolve(args);
										break;
									default:
										var err = new ErrorResponse();
										err.error.errors[0].code = 503;
										err.error.errors[0].reason = 'Value expression not found!';
										err.error.errors[0].message = 'Value expression not found!';
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
						var start = new Date();

						args.result.map(item => {
							args.devices.map(device => {
								if (device.deviceId == item.deviceId) {
									device.inputs.map(input => {
										if (input.inputId == item.inputId) {
											item.type = input.type;
											item.analog = input.analog;
											item.digital = input.digital;
										};
									});
								};
							});
						});

						args.req.body.query.date.to = new Date(args.req.body.query.date.to);
						args.req.body.query.date.from = new Date(args.req.body.query.date.from);
						
						var gap = args.req.body.query.date.to - args.req.body.query.date.from;
						var days = new Date(args.req.body.query.date.to.getFullYear(), args.req.body.query.date.to.getMonth() + 1, 0).getDate();
						var format = 'YYYY/MM/DD HH:mm';
						var grouping = null;

						if (gap > 0 && gap <= (60 * 60 * 1000)) { /* --- HOUR --- */
							format = 'YYYY/MM/DD HH:mm';
							grouping = 'minute';
						} else if (gap > (60 * 60 * 1000) && gap <= (24 * 60 * 60 * 1000)) { /* --- DAY --- */
							format = 'YYYY/MM/DD HH:00';
							grouping = 'hour';
						} else if (gap > (24 * 60 * 60 * 1000) && gap <= (days * 7 * 24 * 60 * 60 * 1000)) { /* --- MONTH --- */
							format = 'YYYY/MM/DD';
							grouping = 'day';
						} else { /* --- YEAR --- */
							format = 'YYYY/MM';
							grouping = 'month';
						};

						switch (args.req.body.display) {
							case ('map'):
								break;
							case ('chart'):
								if (typeof(query.group) != 'undefined' && query.group != null && query.group != '') {
									switch(query.group) {
										case('minute'):
											format = 'YYYY/MM/DD HH:mm';
											grouping = 'minute';
											break;
										case('hour'):
											format = 'YYYY/MM/DD HH:00';
											grouping = 'hour';
											break;
										case('day'):
											format = 'YYYY/MM/DD';
											grouping = 'day';
											break;
										case('month'):
											format = 'YYYY/MM';
											grouping = 'month';
											break;
										case('year'):
											format = 'YYYY';
											grouping = 'year';
											break;
									};
								};
								if (args.req.body.query.counter) {
									var item = args.result[args.result.length - 1];
									var result = [];
									for (let i = 0; i < args.result.length; i++) {
										if (i + 1 < args.result.length) {
											const value = (args.result[i + 1].value - args.result[i].value);
											result.push({
												'date': moment(args.result[i].date).format(format),
												'value': value
											});
										};
									};
									item.value = result;
									args.result = item;
								} else {
									var item = args.result[args.result.length - 1];
									item.value = args.result.map(o => {
										return {
											'date': moment(o.date).format(format),
											'value': o.value
										};
									});
									args.result = item;
								};
								break;
							case ('table'):
								break;
							case ('value'):
								switch (args.req.body.value.expression) {
									case ('last-value'):
									case ('first-value'):
										args.result = args.result[0];
										args.result.date = moment(args.result.date).format(format);
										break;
									case ('predicted-value'):
										if (args.req.body.query.counter) {
											try {
												var item = args.result[args.result.length - 1];
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
												var total = result.reduce((a, b) => a + b, 0);
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
												item.value = parseFloat((average * max).toFixed(2));
												args.result = item;
												args.result.date = moment(args.result.date).format(format);
											} catch (error) {
												console.log(error.message);
											};
										} else {
											var item = args.result[args.result.length - 1];
											var total = args.result.reduce((a, b) => a + b, 0);
											var average = total / args.result.length;
											item.value = parseFloat(average.toFixed(2));
											args.result = item;
											args.result.date = moment(args.result.date).format(format);
										};
										break;
								};
								break;
						};
						console.log('BLL PROCESSING DATA SPEED: ', new Date() - start);
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

	return {
		'reports': bllReports,
		'schedule': bllSchedule
	};
};

exports.module = module;