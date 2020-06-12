var Q           = require('q');
var db          = require('./db/mongo');
var cors        = require('cors');
var http        = require('http');
var chalk       = require('chalk');
var logger      = require('./lib/logger');
var express     = require('express');
var request     = require('request');
var responder   = require('./lib/responder');
var bodyParser  = require('body-parser');

global.__base       = __dirname + '/';
global.__logger     = new logger.module();
global.__settings   = require('./config.json');
global.__responder  = new responder.module();

try { 
    var portal = {
        errorResponse: {
            "error": {
                "code":     401,
                "message":  "Invalid Credentials",
                "errors":[{
                    "reason":       "Reporting Error",
                    "message":      "Invalid Credentials",
                    "locaction":    "portal",
                    "locationType": "header"
                }]
            },
            "hiddenErrors": []
        },

        api: (args) => {
            var deferred = Q.defer();

            try {
                var app  = express();
                app.use(cors());
                app.use(bodyParser.urlencoded({
                    'limit':          '50mb',
                    'extended':       true,
                    'parameterLimit': 50000
                }));
                app.use(bodyParser.json({
                    'limit': '50mb'
                }));

                if (args.settings.authentication) {
                    app.use((req, res, next) => {
                        if (req.method != 'GET' && req.method != 'PUT') {
                            __logger.LogData('', 'authCheck');
                            __logger.LogData('', req.originalUrl);
                            __logger.LogData('', req.body);
                            tools.authenticate(req)
                            .then(result => {
                                next(); 
                            }, err => {
                                var error = {"error":err};
                                __logger.LogData('authCheck error: ' +  JSON.stringify(err));
                                error.error.code             = 401;
                                error.error.errors[0].code   = 401;
                                __responder.errorResponse(req, res, error);
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
                __logger.LogData('','Loaded ./api/reporting/reports');

                var schedule = require('./api/schedule');
                app.use('/reporting/schedule', schedule);
                __logger.LogData('','Loaded ./api/reporting/schedule');

                app.use((err, req, res, next) => {
                    portal.errorResponse.error.code               = 500;
                    portal.errorResponse.error.message            = 'Something broke';
                    portal.errorResponse.error.errors[0].code     = 500;
                    portal.errorResponse.error.errors[0].message  = 'Something broke';
                    portal.errorResponse.hiddenErrors.push(err.stack);
                    __responder.error(req, res, portal.errorResponse);
                });

                var server = http.createServer(app);
                server.listen(args.settings.localwebserver.port);

                deferred.resolve(args);
            } catch(e) {
                __logger.LogData('initAPI catch error: ' +  e);
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
            var deferred    = Q.defer();

            try {
                __logger.init(args.settings.logger);
                __logger.LogData('','Logger Init');
                deferred.resolve(args);
            } catch(err) {
                deferred.reject(err);
            };

            return deferred.promise;
        },

        database: (args) => {
            var deferred = Q.defer();

            db.connect().then(database => {
                global.__database = database;
                deferred.resolve(args);
            }, err => {
                __logger.LogData('Database Connection Error: ' +  err);
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

    var tools = {
        authenticate: function(req) {
            var deferred = Q.defer();

            var email           = req.body.header.email;
            var token           = req.headers.authorization;
            var appId    = req.body.header.appId;

            if (typeof(token) == 'undefined') {
                __logger.LogData('tools.authenticate. token undefined');

                deferred.reject(portal.errorResponse);
                
                return deferred.promise;
            };

            var DTO = JSON.stringify(
                {
                    "header":{
                        "email":email, 
                        "appId": appId
                    },
                    "reqURI":req.originalUrl
                });


            var url = __settings.authServer.host + ':' + __settings.authServer.port + __settings.authServer.path;
            request({
                url: url,
                method: "POST",
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': DTO.length,
                    'accept': '*/*'
                },
                body: DTO
            }, function (error, response, body) {
                if (error) {
                    __logger.LogData('tools.authenticate error: ' +  error);
                    deferred.reject(portal.errorResponse);
                } else {
                    var myResult = JSON.parse(response.body);
                    if (typeof myResult.errors == 'undefined') {
                        deferred.resolve(myResult);
                    } else {
                        deferred.reject(myResult);
                    };
                };
            });

            return deferred.promise;
        }
    };

    portal.init({
        'settings': __settings
    });
} catch(error) {
    console.log('The following error has occurred: ', error.message);
};

exports.module = module;