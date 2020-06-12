var Q = require('q');

exports.setRoleList = (args) => {
    var deferred = Q.defer();

    try {
        args.result = args.result.map(o => {
            if (typeof(o.bitid) != "undefined") {
                if (typeof(o.bitid.auth) != "undefined") {
                    if (typeof(o.bitid.auth.users) != "undefined") {
                        o.role = 0;

                        o.bitid.auth.users.map(user => {
                            if (user.email == args.req.body.header.email) {
                                o.role = user.role;
                            };
                        });
                    };
                };
            };
            return o;
        });

        if (typeof(args.req.body.filter) != "undefined" && Array.isArray(args.req.body.filter)) {
            if (args.req.body.filter.indexOf("role") == -1) {
                args.result = args.result.map(o => {
                    delete o.role;
                    return o;
                });
            };
        };

        if (typeof(args.req.body.filter) != "undefined") {
            if (args.req.body.filter.indexOf("users") == -1) {
                args.result = args.result.map(o => {
                    if (typeof(o.bitid) != "undefined") {
                        if (typeof(o.bitid.auth) != "undefined") {
                            if (typeof(o.bitid.auth.users) != "undefined") {
                                delete o.bitid.auth.users;
                            };
                        };
                    };
                    return o;
                });
            };
        };

        deferred.resolve(args);
    } catch(issue) {
        var err                      = bllOrganizations.errorResponse;
        err.error.errors[0].code     = 503;
        err.error.errors[0].message  = issue.message;
        deferred.resolve(err);
    };
    
    return deferred.promise;
};

exports.setRoleObject = (args) => {
    var deferred = Q.defer();

    try {
        if (typeof(args.result.bitid) != "undefined") {
            if (typeof(args.result.bitid.auth) != "undefined") {
                if (typeof(args.result.bitid.auth.users) != "undefined") {
                    args.result.role = 0;

                    args.result.bitid.auth.users.map(user => {
                        if (user.email == args.req.body.header.email) {
                            args.result.role = user.role;
                        };
                    });
                };
            };
        };

        if (typeof(args.req.body.filter) != "undefined" && Array.isArray(args.req.body.filter)) {
            if (args.req.body.filter.indexOf("role") == -1) {
                delete args.result.role;
            };
        };

        if (typeof(args.req.body.filter) != "undefined") {
            if (args.req.body.filter.indexOf("users") == -1) {
                if (typeof(args.result.bitid) != "undefined") {
                    if (typeof(args.result.bitid.auth) != "undefined") {
                        if (typeof(args.result.bitid.auth.users) != "undefined") {
                            delete args.result.bitid.auth.users;
                        };
                    };
                };
                delete args.result.bitid.auth.users;
            };
        };

        deferred.resolve(args);
    } catch(issue) {
        var err = bllOrganizations.errorResponse;
        err.error.errors[0].code     = 503;
        err.error.errors[0].message  = issue.message;
        deferred.resolve(err);
    };
    
    return deferred.promise;
};

exports.insertUserFromAlias = (args) => {
    var email       = args.req.body.header.email;
    var aliases     = this.getUserEmailAndAlias(args.req);
    args.result.map(o => {
        if (typeof(o.bitid) != "undefined") {
            if (typeof(o.bitid.auth) != "undefined") {
                if (typeof(o.bitid.auth.users) != "undefined") {
                    var userFound = false;
                    o.bitid.auth.users.map(user => {
                        if (user.email == email) {
                            userFound = true;
                        };
                    });

                    if (!userFound) {
                        var lastAliasRole = 0;
                        o.bitid.auth.users.map(user => {
                            args.aliases.map(alias => {
                                if (alias == user.email && lastAliasRole < user.role) {
                                    lastAliasRole = user.role;
                                };
                            })
                        });

                        o.bitid.auth.users.map(user => {
                            args.aliases.map(alias => {
                                if (alias == user.email && lastAliasRole == user.role) {
                                    o.bitid.auth.users.push({
                                        'role':     lastAliasRole,
                                        'email':    email
                                    });
                                };
                            })
                        });
                    } else {
                        var lastAliasRole = 0;
                        o.bitid.auth.users.map(user => {
                            aliases.map(alias => {
                                if (alias == user.email && lastAliasRole < user.role) {
                                    lastAliasRole = user.role;
                                };
                            })
                        });

                        o.bitid.auth.users.map(user => {
                            if (email == user.email) {
                                user.role = lastAliasRole;
                            };
                        });
                    };
                };
            };
        };
    });

    return args.result;
};

exports.getUserEmailAndAlias = (req) => {
    var arrEmails       = [req.body.header.email];
    var authorization   = JSON.parse(req.headers.authorization);
    if (typeof(authorization.alias) != "undefined") {
        arrEmails = arrEmails.concat(authorization.alias);
    };
    return arrEmails;
};

exports.insertOwnerIfNoneExists = (args) => {
    var deferred = Q.defer();

    try {
        if (!args.req.body.users || typeof(args.req.body.users) != "undefined") {
            args.req.body.users = [{
                'role':     5,
                'email':    args.req.body.header.email
            }];
        } else {
            var adminFound = false;
            args.req.body.users.map(user => {
                if (user.role == 5) {
                    adminFound = true;
                };
            });

            if (!adminFound) {
                var creatorFound = false;
                args.req.body.users.map(user => {
                    if (user.email == args.req.body.header.email) {
                        user.role       = 5;
                        creatorFound    = true;
                    };
                });
                if (!creatorFound) {
                    args.req.body.users.push({
                        'role':     5,
                        'email':    args.req.body.header.email
                    });
                };
            };
        };
        
        deferred.resolve(args);
    } catch(err) {
        deferred.reject(err);
    };

    return deferred.promise;
};