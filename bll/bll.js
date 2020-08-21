var Q           = require('q');
var tools       = require('../lib/tools');
var dalModule   = require('../dal/dal');

var module = function() {
	var bllReports = {
		errorResponse: {
			"error": {
				"code": 	401,
				"message": 	"Reports Error",
				"errors":[{
					"reason": 		"General Reports Error",
					"message": 		"Reports Error",
					"location": 	"bllReports",
					"locationType": "body"
				}]
			},
			"hiddenErrors":[]
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
				"code": 	401,
				"message": 	"Schedule Error",
				"errors":[{
					"reason": 		"General Schedule Error",
					"message": 		"Schedule Error",
					"location": 	"bllSchedule",
					"locationType": "body"
				}]
			},
			"hiddenErrors":[]
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

	return {
		'reports': 	bllReports,
		'schedule': bllSchedule
	};
};

exports.module = module;