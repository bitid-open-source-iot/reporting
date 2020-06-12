var chai            = require('chai');
var chaiSubset      = require('chai-subset');
chai.use(chaiSubset);

var Q          	= require('q');
var expect      = require('chai').expect;
var should     	= require('chai').should();
var config     	= require('./config.json');
var request		= require('request');

var reportId    = null;

describe('reports', function() {
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

var tools = {
    api: {
        reports: {
            add: () => {
                var deferred = Q.defer();
                
                var url = config.reporting + '/reporting/reports/add';

                tools.post(url, {
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
                
                var url = config.reporting + '/reporting/reports/get';

                tools.post(url, {
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
                
                var url = config.reporting + '/reporting/reports/list';

                tools.post(url, {
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
                
                var url = config.reporting + '/reporting/reports/share';

                tools.post(url, {
                    'role':     4,
                    'email':    'shared@email.com',
                    'reportId': reportId
                })
                .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            },
            update: () => {
                var deferred = Q.defer();
                
                var url = config.reporting + '/reporting/reports/update';

                tools.post(url, {
                    'reportId':    reportId,
                    'description': 'Mocha Test Report Updated'
                })
                .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            },
            delete: () => {
                var deferred = Q.defer();
                
                var url = config.reporting + '/reporting/reports/delete';

                tools.post(url, {
                    'reportId': reportId
                })
                .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            },
            unsubscribe: () => {
                var deferred = Q.defer();
                
                var url = config.reporting + '/reporting/reports/unsubscribe';

                tools.post(url, {
                    'email':    'shared@email.com',
                    'reportId': reportId
                })
                .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            },
            updatesubscriber: () => {
                var deferred = Q.defer();
                
                var url = config.reporting + '/reporting/reports/updatesubscriber';

                tools.post(url, {
                    'role':     2,
                    'email':    'shared@email.com',
                    'reportId': reportId
                })
                .then(deferred.resolve, deferred.resolve);

                return deferred.promise;
            }
        }
    },
    post: (url, payload) => {
        var deferred = Q.defer();

        payload.header = {
            "email":           config.email, 
            "appId":    config.appId
        };
        payload     = JSON.stringify(payload)
        var token   = JSON.stringify(config.token);

        request({
            "headers": {
                'accept':           '*/*',
                'Content-Type':     'application/json; charset=utf-8',
                'Authorization':    token,
                'Content-Length':   payload.length
            },
            "url":    url,
            "body":   payload,
            "method": "POST"
        }, (error, response, body) => {
            if (error) {
                deferred.reject({
                    "error": error
                });
            } else {
                var result = JSON.parse(response.body);
                if (typeof(result.errors) == 'undefined') {
                    deferred.resolve(result);
                } else {
                    deferred.reject(result);
                };
            };
        });

        return deferred.promise;
    }
};