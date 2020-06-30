var Q           = require('q');
var chai        = require('chai');
var fetch		= require('node-fetch');
var expect      = require('chai').expect;
var should     	= require('chai').should();
var config     	= require('./config.json');
var chaiSubset  = require('chai-subset');
chai.use(chaiSubset);

var reportId = null;

describe('Reports', function() {
    it('/reporting/reports/add', function(done) {
        this.timeout(5000);

        tools.api.reports.add()
        .then((result) => {
            try {
                reportId = result.reportId;
                result.should.have.property('reportId');
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });

    it('/reporting/reports/get', function(done) {
        this.timeout(5000);

        tools.api.reports.get()
        .then((result) => {
            try {
                result.should.have.property('url');
                result.should.have.property('role');
                result.should.have.property('type');
                result.should.have.property('users');
                result.should.have.property('query');
                result.should.have.property('reportId');
                result.should.have.property('serverDate');
                result.should.have.property('description');
                result.should.have.property('organizationOnly');
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });

    it('/reporting/reports/list', function(done) {
        this.timeout(5000);

        tools.api.reports.list()
        .then((result) => {
            try {
                result[0].should.have.property('url');
                result[0].should.have.property('role');
                result[0].should.have.property('type');
                result[0].should.have.property('users');
                result[0].should.have.property('query');
                result[0].should.have.property('reportId');
                result[0].should.have.property('serverDate');
                result[0].should.have.property('description');
                result[0].should.have.property('organizationOnly');
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });

    it('/reporting/reports/update', function(done) {
        this.timeout(5000);

        tools.api.reports.update()
        .then((result) => {
            try {
                result.should.have.property('updated');
                expect(result.updated).to.equal(1);
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });

    it('/reporting/reports/share', function(done) {
        this.timeout(5000);

        tools.api.reports.share()
        .then((result) => {
            try {
                result.should.have.property('updated');
                expect(result.updated).to.equal(1);
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });

    it('/reporting/reports/updatesubscriber', function(done) {
        this.timeout(5000);

        tools.api.reports.updatesubscriber()
        .then((result) => {
            try {
                result.should.have.property('updated');
                expect(result.updated).to.equal(1);
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });

    it('/reporting/reports/unsubscribe', function(done) {
        this.timeout(5000);

        tools.api.reports.unsubscribe()
        .then((result) => {
            try {
                result.should.have.property('updated');
                expect(result.updated).to.equal(1);
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });
});

describe('Remove Added Items', function() {
    it('/reporting/reports/delete', function(done) {
        this.timeout(5000);

        tools.api.reports.delete()
        .then((result) => {
            try {
                result.should.have.property('deleted');
                expect(result.deleted).to.equal(1);
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
                done(e);
            };
        });
    });
});

describe('Health Check', function() {
    it('/', function(done) {
        this.timeout(5000);

        tools.api.healthcheck()
        .then((result) => {
            try {
                result.should.have.property('uptime');
                result.should.have.property('memory');
                result.should.have.property('database');
                done();
            } catch(e) {
                done(e);
            };
        }, (err) => {
            try {
                done(err);
            } catch(e) {
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
                    'query': {
                        "body":   [],
                        "method": "GET"
                    },
                    'users': [{
                        'role':  5,
                        'email': config.email
                    }], // optional
                    'url':              'https://url',
                    'type':             'ds',
                    'description':      'Mocha Test Report',
                    'organizationOnly': 1
                })
                .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            },
            get: () => {
                var deferred = Q.defer();
                
                tools.post('/reporting/reports/get', {
                    'filter': [
                        'url',
                        'role',
                        'type',
                        'users',
                        'query',
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
            list: () => {
                var deferred = Q.defer();
                
                tools.post('/reporting/reports/list', {
                    'filter': [
                        'url',
                        'role',
                        'type',
                        'users',
                        'query',
                        'reportId',
                        'serverDate',
                        'description',
                        'organizationOnly'
                    ]
                })
                .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            },
            share: () => {
                var deferred = Q.defer();
                
                tools.post('/reporting/reports/share', {
                    'role':     4,
                    'email':    'shared@email.com',
                    'reportId': reportId
                })
                .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            },
            update: () => {
                var deferred = Q.defer();
                
                tools.post('/reporting/reports/update', {
                    'reportId':    reportId,
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
                    'email':    'shared@email.com',
                    'reportId': reportId
                })
                .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            },
            updatesubscriber: () => {
                var deferred = Q.defer();
                
                tools.post('/reporting/reports/updatesubscriber', {
                    'role':     2,
                    'email':    'shared@email.com',
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
                'Accept':           '*/*',
                'Referer':          '127.0.0.1',
                'Content-Type':     'application/json; charset=utf-8',
                'Authorization':    JSON.stringify(config.token),
                'Content-Length':   payload.length
            },
            'body':   payload,
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
                'Accept':           '*/*',
                'Referer':          '127.0.0.1',
                'Content-Type':     'application/json; charset=utf-8',
                'Authorization':    JSON.stringify(config.token),
                'Content-Length':   payload.length
            },
            'body':   payload,
            'method': 'POST'
        });
        
        const result = await response.json();

        deferred.resolve(result);
        
        return deferred.promise;
    }
};