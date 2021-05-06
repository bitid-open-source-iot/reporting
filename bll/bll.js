const Q = require('q');
const tools = require('../lib/tools');
const moment = require('moment');
const telemetry = require('../lib/telemetry');
const dalModule = require('../dal/dal');
const ErrorResponse = require('../lib/error-response');

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
					// args.req.body.users.map(user => {
					// 	__socket.send(user.email, 'reports:add', {
					// 		reportId: args.result._id
					// 	});
					// });
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

			args.req.body.inputId = [];
			args.req.body.deviceId = [];

			args.req.body.points.filter(point => {
				if (point.type == 'array' && point.deviceId && point.inputId) {
					return true;
				} else if (point.type == 'value' && point.deviceId && point.inputId && point.expression) {
					return true;
				} else {
					return false;
				};
			}).map(point => {
				let ifound = false;
				args.req.body.inputId.map(id => {
					if (id == point.inputId) {
						ifound = true;
					};
				});
				if (!ifound) {
					args.req.body.inputId.push(point.inputId);
				};
				let dfound = false;
				args.req.body.deviceId.map(id => {
					if (id == point.deviceId) {
						dfound = true;
					};
				});
				if (!dfound) {
					args.req.body.deviceId.push(point.deviceId);
				};
			})

			var dal = new dalModule.module();
			dal.reports.validate(args)
				.then(args => {
					var deferred = Q.defer();

					try {
						args.req.body.points.map(point => {
							point.valid = false;
							args.devices.map(device => {
								if (device.deviceId == point.deviceId) {
									device.inputs.map(input => {
										if (input.inputId == point.inputId) {
											if (input.type == 'analog' && ['CI1', 'CI2', 'CI3', 'CI4', 'CI5', 'CI6', 'CI7', 'CI8'].includes(input.analog.key)) {
												point.counter = true;
											} else {
												point.counter = false;
											};
											point.valid = true;
											point.config = input;
											if (point.type == 'value') {
												switch (point.expression) {
													case ('last-value'):
														point.params = telemetry.historical.inputs.value.last({
															'date': args.req.body.date,
															'group': point.group,
															'inputId': point.inputId,
															'deviceId': point.deviceId
														}, args.devices);
														break;
													case ('first-value'):
														point.params = telemetry.historical.inputs.value.first({
															'date': args.req.body.date,
															'group': point.group,
															'inputId': point.inputId,
															'deviceId': point.deviceId
														}, args.devices);
														break;
													case ('predict-value'):
														point.params = telemetry.historical.inputs.value.predict({
															'date': args.req.body.date,
															'group': point.group,
															'inputId': point.inputId,
															'deviceId': point.deviceId
														}, args.devices);
														break;
												};
											} else if (point.type == 'array') {
												point.params = telemetry.historical.inputs.data({
													'date': args.req.body.date,
													'group': point.group,
													'inputId': point.inputId,
													'deviceId': point.deviceId
												}, args.devices);
											};
										};
									});
								};
							});
						});

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
					var deferred = Q.defer();

					try {
						args.req.body.points.reduce((promise, point) => {
							return promise.then(() => {
								var deferred = Q.defer();

								var dal = new dalModule.module();
								dal.reports.data(point)
									.then(res => {
										point.result = res.result;
										switch (point.type) {
											case ('array'):
												if (typeof (point.group) != 'undefined' && point.group != null && point.group != '') {
													switch (point.group) {
														case ('minute'):
															point.format = 'YYYY/MM/DD HH:mm';
															break;
														case ('hour'):
															point.format = 'YYYY/MM/DD HH:00';
															break;
														case ('day'):
															point.format = 'YYYY/MM/DD';
															break;
														case ('month'):
															point.format = 'YYYY/MM';
															break;
														case ('year'):
															point.format = 'YYYY';
															break;
													};
												};
												if (point.counter) {
													var item = res.result[res.result.length - 1];
													var result = [];
													for (let i = 0; i < res.result.length; i++) {
														if (i + 1 < res.result.length) {
															result.push({
																'date': moment(res.result[i].date).format(point.format),
																'value': res.result[i + 1].value - res.result[i].value
															});
														};
													};
													res.result = result;
												} else {
													var item = res.result[res.result.length - 1];
													item.value = res.result.map(o => {
														if (item.type == 'analog' && typeof (item.analog.offset) != 'undefined' && item.analog.offset !== null && item.analog.offset != '') {
															o.value = o.value + parseFloat(item.analog.offset);
														};
														return {
															'date': moment(o.date).format(point.format),
															'value': o.value
														};
													});
													res.result = item.value;
												};
												break;
											case ('value'):
												if (typeof (point.group) != 'undefined' && point.group != null && point.group != '') {
													switch (point.group) {
														case ('minute'):
															point.format = 'YYYY/MM/DD HH:mm';
															break;
														case ('hour'):
															point.format = 'YYYY/MM/DD HH:00';
															break;
														case ('day'):
															point.format = 'YYYY/MM/DD';
															break;
														case ('month'):
															point.format = 'YYYY/MM';
															break;
														case ('year'):
															point.format = 'YYYY';
															break;
													};
												};
												switch (point.expression) {
													case ('last-value'):
													case ('first-value'):
														res.result = res.result[0];
														if (res.result.type == 'analog' && typeof (res.result.analog.offset) != 'undefined' && res.result.analog.offset !== null && res.result.analog.offset != '') {
															res.result.value = res.result.value + parseFloat(res.result.analog.offset);
														};
														res.result.date = moment(res.result.date).format(point.format);
														break;
													case ('predicted-value'):
														if (args.req.body.counter) {
															try {
																var item = res.result[res.result.length - 1];
																var result = [];
																res.result.map(o => {
																	if (o.type == 'analog' && typeof (o.analog.offset) != 'undefined' && o.analog.offset !== null && o.analog.offset != '') {
																		o.value = o.value + parseFloat(o.analog.offset);
																	};
																});
																for (let i = 0; i < res.result.length; i++) {
																	if (i + 1 < res.result.length) {
																		result.push(res.result[i + 1].value - res.result[i].value);
																	};
																};
																args.req.body.date.to = new Date(args.req.body.date.to);
																args.req.body.date.from = new Date(args.req.body.date.from);

																var max = 0;
																var gap = args.req.body.date.to - args.req.body.date.from;
																var days = new Date(args.req.body.date.to.getFullYear(), args.req.body.date.to.getMonth() + 1, 0).getDate();
																var total = result.reduce((a, b) => a + b, 0);
																var average = total / result.length;

																if (gap > 0 && gap <= (60 * 60 * 1000)) { /* --- HOUR --- */
																	max = 60;
																} else if (gap > (60 * 60 * 1000) && gap <= (24 * 60 * 60 * 1000)) { /* --- DAY --- */
																	max = 24;
																} else if (gap > (24 * 60 * 60 * 1000) && gap <= (days * 7 * 24 * 60 * 60 * 1000)) { /* --- MONTH --- */
																	max = new Date(args.req.body.date.to.getFullYear(), args.req.body.date.to.getMonth() + 1, 0).getDate();
																} else { /* --- YEAR --- */
																	max = 12;
																};
																item.value = parseFloat((average * max).toFixed(2));
																res.result = item;
																res.result.date = moment(res.result.date).format(point.format);
															} catch (error) {
																__logger.error(error.message);
															};
														} else {
															var item = res.result[res.result.length - 1];
															res.result.map(o => {
																if (o.type == 'analog' && typeof (o.analog.offset) != 'undefined' && o.analog.offset !== null && o.analog.offset != '') {
																	o.value = o.value + parseFloat(o.analog.offset);
																};
															});
															var total = res.result.reduce((a, b) => a + b, 0);
															var average = total / res.result.length;
															item.value = parseFloat(average.toFixed(2));
															res.result = item;
															res.result.date = moment(res.result.date).format(point.format);
														};
														break;
												};
												point.result = point.result.value;
												break;
										};
										point.type = point.config.type;
										point.analog = point.config.analog;
										point.digital = point.config.digital;
										deferred.resolve();
									})
									.catch(err => {
										deferred.resolve();
									});

								return deferred.promise;
							})
						}, Promise.resolve()).then(() => {
							deferred.resolve(args);
						});
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
					__responder.success(req, res, args.req.body.points);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		share: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			args.req.body.filter = ['users'];

			var dal = new dalModule.module();
			dal.reports.get(args)
				.then(dal.reports.share, null)
				.then(args => {
					// args.report.bitid.auth.users.map(user => __socket.send(user.email, 'reports:share', args.req.body));
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

			args.req.body.filter = ['users'];

			var dal = new dalModule.module();
			dal.reports.get(args)
				.then(dal.reports.update, null)
				.then(args => {
					// args.report.bitid.auth.users.map(user => __socket.send(user.email, 'reports:update', args.req.body));
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

			args.req.body.filter = ['users'];

			var dal = new dalModule.module();
			dal.reports.get(args)
				.then(dal.reports.delete, null)
				.then(args => {
					// args.report.bitid.auth.users.map(user => __socket.send(user.email, 'reports:delete', args.req.body));
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

			args.req.body.filter = ['users'];

			var dal = new dalModule.module();
			dal.reports.get(args)
				.then(dal.reports.unsubscribe, null)
				.then(args => {
					// args.report.bitid.auth.users.map(user => __socket.send(user.email, 'reports:unsubscribe', args.req.body));
					__responder.success(req, res, args.result);
				}, err => {
					__responder.error(req, res, err);
				});
		},

		changeowner: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			args.req.body.filter = ['users'];

			var dal = new dalModule.module();
			dal.reports.get(args)
				.then(dal.reports.changeowner, null)
				.then(args => {
					// args.report.bitid.auth.users.map(user => __socket.send(user.email, 'reports:change-owner', args.req.body));
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

			args.req.body.filter = ['users'];

			var dal = new dalModule.module();
			dal.reports.get(args)
				.then(dal.reports.updatesubscriber, null)
				.then(args => {
					// args.report.bitid.auth.users.map(user => __socket.send(user.email, 'reports:update-subscriber', args.req.body));
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

		changeowner: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			var dal = new dalModule.module();
			dal.reports.changeowner(args)
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