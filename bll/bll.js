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

		load: (req, res) => {
			var args = {
				'req': req,
				'res': res
			};

			args.req.body.filter = ['layout'];
			args.req.body.inputId = [];
			args.req.body.deviceId = [];

			var dal = new dalModule.module();
			dal.reports.get(args)
				.then(args => {
					var deferred = Q.defer();

					try {
						args.rows = args.result.layout[args.req.body.layout];
						args.columns = [];
						delete args.result;
						args.rows.map(row => {
							row.columns.map(column => {
								if (column.type == 'value') {
									args.columns.push({
										'type': column.type,
										'rowId': row.id,
										'inputId': column.inputId,
										'deviceId': column.deviceId,
										'columnId': column.id,
										'expression': column.expression
									});
								} else if (column.type == 'chart') {
									column.series.map(series => {
										args.columns.push({
											'type': column.type,
											'rowId': row.id,
											'inputId': series.inputId,
											'deviceId': series.deviceId,
											'columnId': column.id,
											'seriesId': series.id
										});
									});
								};
							});
						});
						args.columns.map(column => {
							let ifound = false;
							args.req.body.inputId.map(id => {
								if (id == column.inputId) {
									ifound = true;
								};
							});
							if (!ifound) {
								args.req.body.inputId.push(column.inputId);
							};
							let dfound = false;
							args.req.body.deviceId.map(id => {
								if (id == column.deviceId) {
									dfound = true;
								};
							});
							if (!dfound) {
								args.req.body.deviceId.push(column.deviceId);
							};
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
				.then(dal.reports.validate, null)
				.then(args => {
					var deferred = Q.defer();

					try {
						args.columns.map(o => {
							args.devices.map(device => {
								if (o.deviceId == device.deviceId) {
									device.inputs.map(input => {
										if (o.inputId == input.inputId) {
											o.config = input;
											if (o.type == 'value') {
												switch (o.expression) {
													case ('last-value'):
														o.params = telemetry.historical.inputs.value.last({
															'date': args.req.body.date,
															'inputId': o.inputId,
															'deviceId': o.deviceId
														}, args.devices);
														break;
													case ('first-value'):
														o.params = telemetry.historical.inputs.value.first({
															'date': args.req.body.date,
															'inputId': o.inputId,
															'deviceId': o.deviceId
														}, args.devices);
														break;
													case ('predict-value'):
														o.params = telemetry.historical.inputs.value.predict({
															'date': args.req.body.date,
															'inputId': o.inputId,
															'deviceId': o.deviceId
														}, args.devices);
														break;
												};
											} else if (o.type == 'chart') {
												o.params = telemetry.historical.inputs.data({
													'date': args.req.body.date,
													'inputId': o.inputId,
													'deviceId': o.deviceId
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
						args.columns.reduce((promise, column) => {
							var deferred = Q.defer();

							dal.reports.data(column)
								.then(res => {
									column.result = res.result;
									switch (column.type) {
										case ('chart'):
											if (typeof (args.req.body.group) != 'undefined' && args.req.body.group != null && args.req.body.group != '') {
												switch (args.req.body.group) {
													case ('minute'):
														format = 'YYYY/MM/DD HH:mm';
														grouping = 'minute';
														break;
													case ('hour'):
														format = 'YYYY/MM/DD HH:00';
														grouping = 'hour';
														break;
													case ('day'):
														format = 'YYYY/MM/DD';
														grouping = 'day';
														break;
													case ('month'):
														format = 'YYYY/MM';
														grouping = 'month';
														break;
													case ('year'):
														format = 'YYYY';
														grouping = 'year';
														break;
												};
											};
											if (column.counter) {
												var item = res.result[res.result.length - 1];
												var result = [];
												for (let i = 0; i < res.result.length; i++) {
													if (i + 1 < res.result.length) {
														let value = (res.result[i + 1].value - res.result[i].value);
														// if (item.type == 'analog' && typeof(item.analog.offset) != 'undefined' && item.analog.offset !== null && item.analog.offset != '') {
														// 	value = value + parseFloat(item.analog.offset);
														// };
														result.push({
															'date': moment(res.result[i].date).format(format),
															'value': value
														});
													};
												};
												item.value = result;
												res.result = item;
											} else {
												var item = res.result[res.result.length - 1];
												item.value = res.result.map(o => {
													if (item.type == 'analog' && typeof (item.analog.offset) != 'undefined' && item.analog.offset !== null && item.analog.offset != '') {
														o.value = o.value + parseFloat(item.analog.offset);
													};
													return {
														'date': moment(o.date).format(format),
														'value': o.value
													};
												});
												res.result = item;
											};
											break;
										case ('value'):
											switch (column.expression) {
												case ('last-value'):
												case ('first-value'):
													res.result = res.result[0];
													if (res.result.type == 'analog' && typeof (res.result.analog.offset) != 'undefined' && res.result.analog.offset !== null && res.result.analog.offset != '') {
														res.result.value = res.result.value + parseFloat(res.result.analog.offset);
													};
													res.result.date = moment(res.result.date).format(format);
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
															res.result.date = moment(res.result.date).format(format);
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
														res.result.date = moment(res.result.date).format(format);
													};
													break;
											};
											break;
									};
									deferred.resolve();
								})
								.catch(err => {
									deferred.resolve();
								});

							return deferred.promise;
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
					__responder.success(req, res, args.columns);
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

						if (args.req.body.type == 'value') {
							switch (args.req.body.expression) {
								case ('last-value'):
									args.params = telemetry.historical.inputs.value.last(args.req.body, args.devices);
									deferred.resolve(args);
									break;
								case ('first-value'):
									args.params = telemetry.historical.inputs.value.first(args.req.body, args.devices);
									deferred.resolve(args);
									break;
								case ('predicted-value'):
									args.params = telemetry.historical.inputs.value.predict(args.req.body, args.devices);
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
						} else if (args.req.body.type == 'chart') {
							args.params = telemetry.historical.inputs.data(args.req.body, args.devices);
							deferred.resolve(args);
						} else {
							var err = new ErrorResponse();
							err.error.errors[0].code = 503;
							err.error.errors[0].reason = 'Display type not found!';
							err.error.errors[0].message = 'Display type not found!';
							deferred.reject(err);
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

						args.req.body.date.to = new Date(args.req.body.date.to);
						args.req.body.date.from = new Date(args.req.body.date.from);

						var gap = args.req.body.date.to - args.req.body.date.from;
						var days = new Date(args.req.body.date.to.getFullYear(), args.req.body.date.to.getMonth() + 1, 0).getDate();
						var format = 'YYYY/MM/DD HH:mm';

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

						switch (args.req.body.type) {
							case ('chart'):
								if (typeof (args.req.body.group) != 'undefined' && args.req.body.group != null && args.req.body.group != '') {
									switch (args.req.body.group) {
										case ('minute'):
											format = 'YYYY/MM/DD HH:mm';
											grouping = 'minute';
											break;
										case ('hour'):
											format = 'YYYY/MM/DD HH:00';
											grouping = 'hour';
											break;
										case ('day'):
											format = 'YYYY/MM/DD';
											grouping = 'day';
											break;
										case ('month'):
											format = 'YYYY/MM';
											grouping = 'month';
											break;
										case ('year'):
											format = 'YYYY';
											grouping = 'year';
											break;
									};
								};
								if (args.req.body.counter) {
									var item = args.result[args.result.length - 1];
									var result = [];
									for (let i = 0; i < args.result.length; i++) {
										if (i + 1 < args.result.length) {
											let value = (args.result[i + 1].value - args.result[i].value);
											// if (item.type == 'analog' && typeof(item.analog.offset) != 'undefined' && item.analog.offset !== null && item.analog.offset != '') {
											// 	value = value + parseFloat(item.analog.offset);
											// };
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
										if (item.type == 'analog' && typeof (item.analog.offset) != 'undefined' && item.analog.offset !== null && item.analog.offset != '') {
											o.value = o.value + parseFloat(item.analog.offset);
										};
										return {
											'date': moment(o.date).format(format),
											'value': o.value
										};
									});
									args.result = item;
								};
								break;
							case ('value'):
								switch (args.req.body.expression) {
									case ('last-value'):
									case ('first-value'):
										args.result = args.result[0];
										if (args.result.type == 'analog' && typeof (args.result.analog.offset) != 'undefined' && args.result.analog.offset !== null && args.result.analog.offset != '') {
											args.result.value = args.result.value + parseFloat(args.result.analog.offset);
										};
										args.result.date = moment(args.result.date).format(format);
										break;
									case ('predicted-value'):
										if (args.req.body.counter) {
											try {
												var item = args.result[args.result.length - 1];
												var result = [];
												args.result.map(o => {
													if (o.type == 'analog' && typeof (o.analog.offset) != 'undefined' && o.analog.offset !== null && o.analog.offset != '') {
														o.value = o.value + parseFloat(o.analog.offset);
													};
												});
												for (let i = 0; i < args.result.length; i++) {
													if (i + 1 < args.result.length) {
														result.push(args.result[i + 1].value - args.result[i].value);
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
												args.result = item;
												args.result.date = moment(args.result.date).format(format);
											} catch (error) {
												__logger.error(error.message);
											};
										} else {
											var item = args.result[args.result.length - 1];
											args.result.map(o => {
												if (o.type == 'analog' && typeof (o.analog.offset) != 'undefined' && o.analog.offset !== null && o.analog.offset != '') {
													o.value = o.value + parseFloat(o.analog.offset);
												};
											});
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