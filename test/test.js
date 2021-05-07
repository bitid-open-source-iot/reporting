const Q = require('q');
const chai = require('chai');
const fetch = require('node-fetch');
const expect = require('chai').expect;
const should = require('chai').should();
const config = require('./config.json');
const subset = require('chai-subset');
const WebSocketClient = require('websocket').client;
chai.use(subset);

var email = config.email;
var socket = null;
var client = new WebSocketClient();
var reportId = null;

describe('WebSocket', function () {
    it('Connect', function (done) {
        this.timeout(5000);

        client.on('connect', connection => {
            socket = connection;
            done();
        });

        client.on('connectFailed', error => {
            console.error('connection failed: ', error);
            done();
        });

        client.connect([config.websocket, '/reporting/reports/socket?email', config.email, '&token=', JSON.stringify(config.token), '&appId=', config.appId].join(''));
    });

    it('Disconnect', function (done) {
        this.timeout(5000);
        
        socket.close();
        done();
    });
});

describe('Reports', function () {
    it('/reporting/reports/add', function (done) {
        this.timeout(5000);

        tools.api.reports.add()
            .then((result) => {
                try {
                    reportId = result.reportId;
                    result.should.have.property('reportId');
                    done();
                } catch (e) {
                    done(e);
                };
            }, (err) => {
                try {
                    done(err);
                } catch (e) {
                    done(e);
                };
            });
    });

    it('/reporting/reports/get', function (done) {
        this.timeout(5000);

        tools.api.reports.get()
            .then((result) => {
                try {
                    result.should.have.property('role');
                    // result.should.have.property('views');
                    result.should.have.property('users');
                    result.should.have.property('layout');
                    result.should.have.property('settings');
                    result.should.have.property('reportId');
                    result.should.have.property('serverDate');
                    result.should.have.property('description');
                    result.should.have.property('organizationOnly');
                    done();
                } catch (e) {
                    done(e);
                };
            }, (err) => {
                try {
                    done(err);
                } catch (e) {
                    done(e);
                };
            });
    });

    it('/reporting/reports/list', function (done) {
        this.timeout(5000);

        tools.api.reports.list()
            .then((result) => {
                try {
                    result[0].should.have.property('role');
                    result[0].should.have.property('views');
                    result[0].should.have.property('users');
                    result[0].should.have.property('layout');
                    result[0].should.have.property('reportId');
                    result[0].should.have.property('settings');
                    result[0].should.have.property('serverDate');
                    result[0].should.have.property('description');
                    result[0].should.have.property('organizationOnly');
                    done();
                } catch (e) {
                    done(e);
                };
            }, (err) => {
                try {
                    done(err);
                } catch (e) {
                    done(e);
                };
            });
    });

    it('/reporting/reports/update', function (done) {
        this.timeout(5000);

        tools.api.reports.update()
            .then((result) => {
                try {
                    result.should.have.property('updated');
                    expect(result.updated).to.equal(1);
                    done();
                } catch (e) {
                    done(e);
                };
            }, (err) => {
                try {
                    done(err);
                } catch (e) {
                    done(e);
                };
            });
    });

    it('/reporting/reports/share', function (done) {
        this.timeout(5000);

        tools.api.reports.share()
            .then((result) => {
                try {
                    result.should.have.property('updated');
                    expect(result.updated).to.equal(1);
                    done();
                } catch (e) {
                    done(e);
                };
            }, (err) => {
                try {
                    done(err);
                } catch (e) {
                    done(e);
                };
            });
    });

    if (!config.authenticate) {
        it('/reporting/reports/change-owner', function (done) {
            this.timeout(5000);

            tools.api.reports.changeowner(config.share)
                .then(result => {
                    try {
                        result.should.containSubset({
                            'updated': 1
                        });
                        done();
                    } catch (e) {
                        done(e);
                    };
                }, err => {
                    try {
                        done(err);
                    } catch (e) {
                        done(e);
                    };
                });
        });

        it('/reporting/reports/change-owner', function (done) {
            this.timeout(5000);

            config.email = config.share;
            tools.api.reports.changeowner(email)
                .then(result => {
                    try {
                        config.email = email;
                        result.should.containSubset({
                            'updated': 1
                        });
                        done();
                    } catch (e) {
                        done(e);
                    };
                }, err => {
                    try {
                        done(err);
                    } catch (e) {
                        done(e);
                    };
                });
        });
    };

    it('/reporting/reports/update-subscriber', function (done) {
        this.timeout(5000);

        tools.api.reports.updatesubscriber()
            .then((result) => {
                try {
                    result.should.have.property('updated');
                    expect(result.updated).to.equal(1);
                    done();
                } catch (e) {
                    done(e);
                };
            }, (err) => {
                try {
                    done(err);
                } catch (e) {
                    done(e);
                };
            });
    });

    it('/reporting/reports/unsubscribe', function (done) {
        this.timeout(5000);

        tools.api.reports.unsubscribe()
            .then((result) => {
                try {
                    result.should.have.property('updated');
                    expect(result.updated).to.equal(1);
                    done();
                } catch (e) {
                    done(e);
                };
            }, (err) => {
                try {
                    done(err);
                } catch (e) {
                    done(e);
                };
            });
    });
});

describe('Remove Added Items', function () {
    it('/reporting/reports/delete', function (done) {
        this.timeout(5000);

        tools.api.reports.delete()
            .then((result) => {
                try {
                    result.should.have.property('deleted');
                    expect(result.deleted).to.equal(1);
                    done();
                } catch (e) {
                    done(e);
                };
            }, (err) => {
                try {
                    done(err);
                } catch (e) {
                    done(e);
                };
            });
    });
});

describe('Health Check', function () {
    it('/', function (done) {
        this.timeout(5000);

        tools.api.healthcheck()
            .then((result) => {
                try {
                    result.should.have.property('uptime');
                    result.should.have.property('memory');
                    result.should.have.property('database');
                    done();
                } catch (e) {
                    done(e);
                };
            }, (err) => {
                try {
                    done(err);
                } catch (e) {
                    done(e);
                };
            });
    });
});

var tools = {
    api: {
        reports: {
            add: () => {
                var deferred = Q.defer();

                tools.post('/reporting/reports/add', {
                    'layout': {
                        'mobile': [],
                        'tablet': [],
                        'desktop': []
                    },
                    'settings': {
                        'fill': {
                            'color': '#FFFFFF',
                            'opacity': 25,
                        },
                        'font': {
                            'size': 24,
                            'color': '#FFFFFF',
                            'family': 'Arial',
                            'opacity': 100,
                            'vertical': 'center',
                            'horizontal': 'center'
                        },
                        'board': {
                            'color': '#FFFFFF',
                            'opacity': 25,
                        },
                        'stroke': {
                            'color': '#FFFFFF',
                            'width': 2,
                            'style': 'solid',
                            'opacity': 25,
                        },
                        'banner': {
                            'size': 24,
                            'color': '#FFFFFF',
                            'family': 'Arial',
                            'opacity': 100,
                            'vertical': 'center',
                            'horizontal': 'center'
                        }
                    },
                    'description': 'Mocha Test Report',
                    'organizationOnly': 1
                })
                    .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            },
            get: () => {
                var deferred = Q.defer();

                tools.post('/reporting/reports/get', {
                    'filter': [
                        'role',
                        'views',
                        'users',
                        'layout',
                        'reportId',
                        'settings',
                        'serverDate',
                        'description',
                        'organizationOnly'
                    ],
                    'reportId': reportId
                })
                    .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            },
            list: () => {
                var deferred = Q.defer();

                tools.post('/reporting/reports/list', {
                    'filter': [
                        'role',
                        'views',
                        'users',
                        'layout',
                        'settings',
                        'reportId',
                        'serverDate',
                        'description',
                        'organizationOnly'
                    ],
                    'reportId': reportId
                })
                    .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            },
            share: () => {
                var deferred = Q.defer();

                tools.post('/reporting/reports/share', {
                    'role': 4,
                    'email': config.share,
                    'reportId': reportId
                })
                    .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            },
            update: () => {
                var deferred = Q.defer();

                tools.post('/reporting/reports/update', {
                    'reportId': reportId,
                    'description': 'Mocha Test Report Updated'
                })
                    .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            },
            delete: () => {
                var deferred = Q.defer();

                tools.post('/reporting/reports/delete', {
                    'reportId': reportId
                })
                    .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            },
            unsubscribe: () => {
                var deferred = Q.defer();

                tools.post('/reporting/reports/unsubscribe', {
                    'email': config.share,
                    'reportId': reportId
                })
                    .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            },
            changeowner: (email) => {
                var deferred = Q.defer();

                tools.post('/reporting/reports/change-owner', {
                    'email': email,
                    'reportId': reportId
                })
                    .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            },
            updatesubscriber: () => {
                var deferred = Q.defer();

                tools.post('/reporting/reports/update-subscriber', {
                    'role': 2,
                    'email': config.share,
                    'reportId': reportId
                })
                    .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            }
        },
        healthcheck: () => {
            var deferred = Q.defer();

            tools.put('/health-check', {})
                .then(deferred.resolve, deferred.resolve);

            return deferred.promise;
        }
    },
    put: async (url, payload) => {
        var deferred = Q.defer();

        payload.header = {
            'email': config.email,
            'appId': config.appId
        };

        payload = JSON.stringify(payload);

        const response = await fetch(config.reporting + url, {
            'headers': {
                'Accept': '*/*',
                'Referer': '127.0.0.1',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': JSON.stringify(config.token),
                'Content-Length': payload.length
            },
            'body': payload,
            'method': 'PUT'
        });

        const result = await response.json();

        deferred.resolve(result);

        return deferred.promise;
    },
    post: async (url, payload) => {
        var deferred = Q.defer();

        payload.header = {
            'email': config.email,
            'appId': config.appId
        };

        payload = JSON.stringify(payload);

        const response = await fetch(config.reporting + url, {
            'headers': {
                'Accept': '*/*',
                'Referer': '127.0.0.1',
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': JSON.stringify(config.token),
                'Content-Length': payload.length
            },
            'body': payload,
            'method': 'POST'
        });

        const result = await response.json();

        deferred.resolve(result);

        return deferred.promise;
    }
};