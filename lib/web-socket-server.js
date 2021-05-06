const Q = require('q');
const wss = require('websocket').server;
const http = require('http');
const auth = require('./auth');
const format = require('./format');
const crypto = require('crypto');

var module = function () {
    var add = (socket, params) => {
        socket.on('close', (data) => {
            for (var i = global.__sockets.length - 1; i >= 0; i--) {
                if (global.__sockets[i].userId == socket.userId) {
                    global.__sockets.splice(i, 1);
                    break;
                };
            };
        });

        global.__sockets.push({
            'email': format.email(params.email),
            'token': params.token,
            'socket': socket,
            'userId': socket.userId,
            'catagory': params.catagory
        });
    };

    return {
        /*
            Start Data To Socket:
            =======================
            Steps:
            1 - Select users socket by their email
            2 - Send data
        */
        send: (email, catagory, data) => {
            var deferred = Q.defer();

            try {
                var sent = 0;
                for (var i = global.__sockets.length - 1; i >= 0; i--) {
                    if (global.__sockets[i].email == format.email(email) && global.__sockets[i].catagory == catagory) {
                        global.__sockets[i].socket.send(JSON.stringify(data));
                        sent++;
                    };
                };
                deferred.resolve({
                    'sent': sent
                });
            } catch (error) {
                deferred.reject(error);
            };

            return deferred.promise;
        },
        /*
            Start Web Socket Server:
            =======================
            Steps:
            1 - Initialize global sockets for easy access throughout application
            2 - Start server on secified port
            3 - Listen for connection
            4 - Authenticate socket if authentication is enabled
            5 - Listen for socket close event in order to automatically remove socket from global sockets
            6 - Add socket to global sockets
        */
            start: (args) => {
                var deferred = Q.defer();
    
                try {
                    global.__sockets = [];
    
                    var server = http.createServer();
                    server.listen(args.port);
    
                    var wsServer = new wss({
                        'httpServer': server
                    });

                    wsServer.on('request', (request) => {
                        var params = request.resourceURL.query || {};
                        var socket = request.accept(null, request.origin);
                        params.catagory = request.resourceURL.pathname || '';

                        try {
                            socket.userId = (crypto.randomBytes(Math.ceil(64 / 2)).toString('hex').slice(0, 64));
    
                            if (typeof (params.email) != "undefined" && typeof (params.token) != "undefined" && typeof (params.appId) != "undefined") {
                                if (args.authentication) {
                                    auth.authenticate({
                                        'req': {
                                            'body': {
                                                'header': {
                                                    'email': format.email(params.email),
                                                    'appId': params.appId
                                                }
                                            },
                                            'headers': {
                                                'authorization': params.token
                                            }
                                        }
                                    })
                                    .then(res => {
                                        add(socket, params);
                                    })
                                    .catch(err => {
                                        socket.close(4001);
                                    });
                                } else {
                                    add(socket, params);
                                };
                            } else {
                                socket.close(1007);
                            };
                        } catch (err) {
                            console.log(err.message);
                            socket.close(1007);
                        };
                    });
    
                    deferred.resolve(args);
                } catch (error) {
                    deferred.reject(error);
                };
    
                return deferred.promise;
            }
    };
};

exports.module = module;