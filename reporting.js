var Q = require('q');
var db = require('./db/mongo');
var cors = require('cors');
var http = require('http');
var auth = require('./lib/auth');
var chalk = require('chalk');
var express = require('express');
var responder = require('./lib/responder');
var bodyParser = require('body-parser');
var healthcheck = require('@bitid/health-check');

global.__base = __dirname + '/';
global.__logger = require('./lib/logger');
global.__settings = require('./config.json');
global.__responder = new responder.module();

try {
    var portal = {
        errorResponse: {
            "error": {
                "code": 401,
                "message": "Invalid Credentials",
                "errors": [{
                    "reason": "Reporting Error",
                    "message": "Invalid Credentials",
                    "location": "portal",
                    "locationType": "header"
                }]
            },
            "hiddenErrors": []
        },

        api: (args) => {
            var deferred = Q.defer();

            try {
                var app = express();
                app.use(cors());
                app.use(bodyParser.urlencoded({
                    'limit': '50mb',
                    'extended': true,
                    'parameterLimit': 50000
                }));
                app.use(bodyParser.json({
                    'limit': '50mb'
                }));

                if (args.settings.authentication) {
                    app.use((req, res, next) => {
                        /* --- THIS WILL CATER FOR APPS UNTIL WE UPDATE THERE API SERVICES --- */
                        if (typeof (req.body) != "undefined") {
                            if (typeof (req.body.header) != "undefined") {
                                if (typeof (req.body.header.clientIdAuth) != "undefined") {
                                    req.body.header.appId = req.body.header.clientIdAuth;
                                    delete req.body.header.clientIdAuth;
                                };
                            };
                            Object.keys(req.body).map(key => {
                                if (key == "clientId") {
                                    req.body.appId = req.body[key];
                                };
                            });
                        };
                        if (req.method != 'GET' && req.method != 'PUT') {
                            auth.authenticate({
                                'req': req,
                                'res': res
                            })
                                .then(result => {
                                    next();
                                }, err => {
                                    __responder.error(req, res, err);
                                });
                        } else {
                            next();
                        };
                    });
                };

                app.use('/', express.static(__dirname + '/app/dist/reporting'));
                app.get('/*', (req, res) => {
                    res.sendFile(__dirname + '/app/dist/reporting/index.html');
                });

                var reports = require('./api/reports');
                app.use('/reporting/reports', reports);
                __logger.info('Loaded: ./api/reporting/reports');

                var schedule = require('./api/schedule');
                app.use('/reporting/schedule', schedule);
                __logger.info('Loaded: ./api/reporting/schedule');

                app.use('/health-check', healthcheck);
                __logger.info('Loaded: ./api/health-check');

                app.use((err, req, res, next) => {
                    portal.errorResponse.error.code = 500;
                    portal.errorResponse.error.message = 'Something broke';
                    portal.errorResponse.error.errors[0].code = 500;
                    portal.errorResponse.error.errors[0].message = 'Something broke';
                    portal.errorResponse.hiddenErrors.push(err.stack);
                    __responder.error(req, res, portal.errorResponse);
                });

                var server = http.createServer(app);
                server.listen(args.settings.localwebserver.port);

                deferred.resolve(args);
            } catch (e) {
                __logger.error('initAPI catch error: ' + e);
                deferred.reject(e)
            };

            return deferred.promise;
        },

        init: (args) => {
            if (!args.settings.production || !args.settings.authentication) {
                var index = 0;
                console.log('');
                console.log('=======================');
                console.log('');
                console.log(chalk.yellow('Warning: '));
                if (!args.settings.production) {
                    index++;
                    console.log('');
                    console.log(chalk.yellow(index + ': You are running in ') + chalk.red('"Development Mode!"') + chalk.yellow(' This can cause issues if this environment is a production environment!'));
                    console.log('');
                    console.log(chalk.yellow('To enable production mode, set the ') + chalk.bold(chalk.green('production')) + chalk.yellow(' variable in the config to ') + chalk.bold(chalk.green('true')) + chalk.yellow('!'));
                };
                if (!args.settings.authentication) {
                    index++;
                    console.log('');
                    console.log(chalk.yellow(index + ': Authentication is not enabled ') + chalk.yellow(' This can cause issues if this environment is a production environment!'));
                    console.log('');
                    console.log(chalk.yellow('To enable Authentication mode, set the ') + chalk.bold(chalk.green('authentication')) + chalk.yellow(' variable in the config to ') + chalk.bold(chalk.green('true')) + chalk.yellow('!'));
                };
                console.log('');
                console.log('=======================');
                console.log('');
            };

            portal.logger(args)
                .then(portal.api, null)
                .then(portal.database, null)
                .then(args => {
                    console.log('Webserver Running on port: ', args.settings.localwebserver.port);
                }, err => {
                    console.log('Error Initializing: ', err);
                });
        },

        logger: (args) => {
            var deferred = Q.defer();

            __logger.init();
            deferred.resolve(args);

            return deferred.promise;
        },

        database: (args) => {
            var deferred = Q.defer();

            db.connect().then(database => {
                global.__database = database;
                deferred.resolve(args);
            }, err => {
                __logger.error('Database Connection Error: ' + err);
                deferred.reject(err);
            });

            return deferred.promise;
        },

        scheduler: (args) => {
            var deferred = Q.defer();

            deferred.resolve(args);

            return deferred.promise;
        }
    };

    portal.init({
        'settings': __settings
    });
} catch (error) {
    console.log('The following error has occurred: ', error.message);
};

exports.module = module;