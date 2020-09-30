const ObjectId = require("mongodb").ObjectId;

exports.historical = {
    inputs: {
        data: (query, devices) => {
            query = isCounter(query, devices);

            if (typeof(query.inputId) != 'undefined' && query.inputId != null && query.inputId != '') {
                if (Array.isArray(query.inputId) && query.inputId.length > 0) {
                    query.inputId = {
                        $in: query.inputId.map(id => ObjectId(id))
                    };
                } else if (typeof(query.inputId) == 'string' && query.inputId.length == 24) {
                    query.inputId = ObjectId(query.inputId);
                };
            };

            if (typeof(query.deviceId) != 'undefined' && query.deviceId != null && query.deviceId != '') {
                if (Array.isArray(query.deviceId) && query.deviceId.length > 0) {
                    query.deviceId = {
                        $in: query.deviceId.map(id => ObjectId(id))
                    };
                } else if (typeof(query.deviceId) == 'string' && query.deviceId.length == 24) {
                    query.deviceId = ObjectId(query.deviceId);
                };
            };

            query.date.to = new Date(query.date.to);
            query.date.from = new Date(query.date.from);

            const gap = query.date.to - query.date.from;
            const days = new Date(query.date.to.getFullYear(), query.date.to.getMonth() + 1, 0).getDate();
            const group = {
                '_id': {
                    'year': {
                       $year: '$deviceDate'
                    },
                    'month': {
                       $month: '$deviceDate'
                    },
                    'day': {
                       $dayOfMonth: '$deviceDate'
                    },
                    'hour': {
                       $hour: '$deviceDate'
                    },
                    'minute': {
                       $minute: '$deviceDate'
                    },
                    'inputId': '$inputs.inputId',
                    'deviceId': '$deviceId'
                },
                'inputId': {
                    $first: '$inputs.inputId'
                },
                'deviceId': {
                    $first: '$deviceId'
                },
                'date': {
                    $first: '$deviceDate'
                },
                'value': {
                    $avg: '$inputs.value'
                }
            };

            if (query.counter) {
                group.value = {
                    $first: '$inputs.value'
                };
            };
            
            if (gap > 0 && gap <= (60 * 60 * 1000)) { /* --- HOUR --- */
                // clear nothing
            } else if (gap > (60 * 60 * 1000) && gap <= (24 * 60 * 60 * 1000)) { /* --- DAY --- */
                delete group._id.minute;
            } else if (gap > (24 * 60 * 60 * 1000) && gap <= (days * 7 * 24 * 60 * 60 * 1000)) { /* --- MONTH --- */
                delete group._id.hour;
                delete group._id.minute;
            } else { /* --- YEAR --- */
                delete group._id.day;
                delete group._id.hour;
                delete group._id.minute;
            };

            return [
                {
                    $match: {
                        'deviceDate': {
                            $gte: query.date.from,
                            $lte: query.date.to
                        },
                        'deviceId': query.deviceId
                    }
                },
                {
                    $unwind: '$inputs'
                },
                {
                    $match: {
                        'inputs.inputId': query.inputId
                    }
                },
                {
                    $group: group
                },
                {
                    $sort: {
                        'date': 1
                    }
                },
                {
                    $project: {
                        '_id': 0,
                        'date': 1,
                        'value': 1,
                        'inputId': 1,
                        'deviceId': 1
                    }
                }
            ];
        },
        value: {
            last: (query, devices) => {
                query = isCounter(query, devices);

                if (typeof(query.inputId) != 'undefined' && query.inputId != null && query.inputId != '') {
                    if (Array.isArray(query.inputId) && query.inputId.length > 0) {
                        query.inputId = {
                            $in: query.inputId.map(id => ObjectId(id))
                        };
                    } else if (typeof(query.inputId) == 'string' && query.inputId.length == 24) {
                        query.inputId = ObjectId(query.inputId);
                    };
                };

                if (typeof(query.deviceId) != 'undefined' && query.deviceId != null && query.deviceId != '') {
                    if (Array.isArray(query.deviceId) && query.deviceId.length > 0) {
                        query.deviceId = {
                            $in: query.deviceId.map(id => ObjectId(id))
                        };
                    } else if (typeof(query.deviceId) == 'string' && query.deviceId.length == 24) {
                        query.deviceId = ObjectId(query.deviceId);
                    };
                };

                query.date.to = new Date(query.date.to);
                query.date.from = new Date(query.date.from);
    
                const gap = query.date.to - query.date.from;
                const days = new Date(query.date.to.getFullYear(), query.date.to.getMonth() + 1, 0).getDate();
                const group = {
                    '_id': {
                        'year': {
                           $year: '$deviceDate'
                        },
                        'month': {
                           $month: '$deviceDate'
                        },
                        'day': {
                           $dayOfMonth: '$deviceDate'
                        },
                        'hour': {
                           $hour: '$deviceDate'
                        },
                        'minute': {
                           $minute: '$deviceDate'
                        },
                        'inputId': '$inputs.inputId',
                        'deviceId': '$deviceId'
                    },
                    'inputId': {
                        $first: '$inputs.inputId'
                    },
                    'deviceId': {
                        $first: '$deviceId'
                    },
                    'date': {
                        $first: '$deviceDate'
                    },
                    'value': {
                       $last: '$inputs.value'
                    }
                };

                if (query.counter) {
                    group.value = {
                        $max: '$inputs.value'
                    };
                    delete group._id.year;
                    delete group._id.month;
                    delete group._id.day;
                    delete group._id.hour;
                    delete group._id.minute;
                } else {
                    if (gap > 0 && gap <= (60 * 60 * 1000)) { /* --- HOUR --- */
                        // clear nothing
                    } else if (gap > (60 * 60 * 1000) && gap <= (24 * 60 * 60 * 1000)) { /* --- DAY --- */
                        delete group._id.minute;
                    } else if (gap > (24 * 60 * 60 * 1000) && gap <= (days * 7 * 24 * 60 * 60 * 1000)) { /* --- MONTH --- */
                        delete group._id.hour;
                        delete group._id.minute;
                    } else { /* --- YEAR --- */
                        delete group._id.day;
                        delete group._id.hour;
                        delete group._id.minute;
                    };
                };

                return [
                    {
                        $match: {
                            'deviceDate': {
                                $gte: query.date.from,
                                $lte: query.date.to
                            },
                            'deviceId': query.deviceId
                        }
                    },
                    {
                        $unwind: '$inputs'
                    },
                    {
                        $match: {
                            'inputs.inputId': query.inputId
                        }
                    },
                    {
                        $group: group
                    },
                    {
                        $sort: {
                            'date': 1
                        }
                    },
                    {
                        $project: {
                            '_id': 0,
                            'date': 1,
                            'value': 1,
                            'inputId': 1,
                            'deviceId': 1
                        }
                    }
                ];
            },
            first: (query, devices) => {
                query = isCounter(query, devices);

                if (typeof(query.inputId) != 'undefined' && query.inputId != null && query.inputId != '') {
                    if (Array.isArray(query.inputId) && query.inputId.length > 0) {
                        query.inputId = {
                            $in: query.inputId.map(id => ObjectId(id))
                        };
                    } else if (typeof(query.inputId) == 'string' && query.inputId.length == 24) {
                        query.inputId = ObjectId(query.inputId);
                    };
                };

                if (typeof(query.deviceId) != 'undefined' && query.deviceId != null && query.deviceId != '') {
                    if (Array.isArray(query.deviceId) && query.deviceId.length > 0) {
                        query.deviceId = {
                            $in: query.deviceId.map(id => ObjectId(id))
                        };
                    } else if (typeof(query.deviceId) == 'string' && query.deviceId.length == 24) {
                        query.deviceId = ObjectId(query.deviceId);
                    };
                };

                query.date.to = new Date(query.date.to);
                query.date.from = new Date(query.date.from);
    
                const gap = query.date.to - query.date.from;
                const days = new Date(query.date.to.getFullYear(), query.date.to.getMonth() + 1, 0).getDate();
                const group = {
                    '_id': {
                        'year': {
                           $year: '$deviceDate'
                        },
                        'month': {
                           $month: '$deviceDate'
                        },
                        'day': {
                           $dayOfMonth: '$deviceDate'
                        },
                        'hour': {
                           $hour: '$deviceDate'
                        },
                        'minute': {
                           $minute: '$deviceDate'
                        },
                        'inputId': '$inputs.inputId',
                        'deviceId': '$deviceId'
                    },
                    'inputId': {
                        $first: '$inputs.inputId'
                    },
                    'deviceId': {
                        $first: '$deviceId'
                    },
                    'date': {
                        $first: '$deviceDate'
                    },
                    'value': {
                       $first: '$inputs.value'
                    }
                };

                if (query.counter) {
                    group.value = {
                        $min: '$inputs.value'
                    };
                    delete group._id.year;
                    delete group._id.month;
                    delete group._id.day;
                    delete group._id.hour;
                    delete group._id.minute;
                } else {
                    if (gap > 0 && gap <= (60 * 60 * 1000)) { /* --- HOUR --- */
                        // clear nothing
                    } else if (gap > (60 * 60 * 1000) && gap <= (24 * 60 * 60 * 1000)) { /* --- DAY --- */
                        delete group._id.minute;
                    } else if (gap > (24 * 60 * 60 * 1000) && gap <= (days * 7 * 24 * 60 * 60 * 1000)) { /* --- MONTH --- */
                        delete group._id.hour;
                        delete group._id.minute;
                    } else { /* --- YEAR --- */
                        delete group._id.day;
                        delete group._id.hour;
                        delete group._id.minute;
                    };
                };

                return [
                    {
                        $match: {
                            'deviceDate': {
                                $gte: query.date.from,
                                $lte: query.date.to
                            },
                            'deviceId': query.deviceId
                        }
                    },
                    {
                        $unwind: '$inputs'
                    },
                    {
                        $match: {
                            'inputs.inputId': query.inputId
                        }
                    },
                    {
                        $group: group
                    },
                    {
                        $sort: {
                            'date': 1
                        }
                    },
                    {
                        $project: {
                            '_id': 0,
                            'date': 1,
                            'value': 1,
                            'inputId': 1,
                            'deviceId': 1
                        }
                    }
                ];
            },
            predict: (query, devices) => {
                query = isCounter(query, devices);

                if (typeof(query.inputId) != 'undefined' && query.inputId != null && query.inputId != '') {
                    if (Array.isArray(query.inputId) && query.inputId.length > 0) {
                        query.inputId = {
                            $in: query.inputId.map(id => ObjectId(id))
                        };
                    } else if (typeof(query.inputId) == 'string' && query.inputId.length == 24) {
                        query.inputId = ObjectId(query.inputId);
                    };
                };
    
                if (typeof(query.deviceId) != 'undefined' && query.deviceId != null && query.deviceId != '') {
                    if (Array.isArray(query.deviceId) && query.deviceId.length > 0) {
                        query.deviceId = {
                            $in: query.deviceId.map(id => ObjectId(id))
                        };
                    } else if (typeof(query.deviceId) == 'string' && query.deviceId.length == 24) {
                        query.deviceId = ObjectId(query.deviceId);
                    };
                };
    
                query.date.to = new Date(query.date.to);
                query.date.from = new Date(query.date.from);
    
                const gap = query.date.to - query.date.from;
                const days = new Date(query.date.to.getFullYear(), query.date.to.getMonth() + 1, 0).getDate();
                const group = {
                    '_id': {
                        'year': {
                           $year: '$deviceDate'
                        },
                        'month': {
                           $month: '$deviceDate'
                        },
                        'day': {
                           $dayOfMonth: '$deviceDate'
                        },
                        'hour': {
                           $hour: '$deviceDate'
                        },
                        'minute': {
                           $minute: '$deviceDate'
                        },
                        'inputId': '$inputs.inputId',
                        'deviceId': '$deviceId'
                    },
                    'inputId': {
                        $first: '$inputs.inputId'
                    },
                    'deviceId': {
                        $first: '$deviceId'
                    },
                    'date': {
                        $first: '$deviceDate'
                    },
                    'value': {
                        $avg: '$inputs.value'
                    }
                };
    
                if (query.counter) {
                    group.value = {
                        $first: '$inputs.value'
                    };
                };
                
                if (gap > 0 && gap <= (60 * 60 * 1000)) { /* --- HOUR --- */
                    // clear nothing
                } else if (gap > (60 * 60 * 1000) && gap <= (24 * 60 * 60 * 1000)) { /* --- DAY --- */
                    delete group._id.minute;
                } else if (gap > (24 * 60 * 60 * 1000) && gap <= (days * 7 * 24 * 60 * 60 * 1000)) { /* --- MONTH --- */
                    delete group._id.hour;
                    delete group._id.minute;
                } else { /* --- YEAR --- */
                    delete group._id.day;
                    delete group._id.hour;
                    delete group._id.minute;
                };
    
                return [
                    {
                        $match: {
                            'deviceDate': {
                                $gte: query.date.from,
                                $lte: query.date.to
                            },
                            'deviceId': query.deviceId
                        }
                    },
                    {
                        $unwind: '$inputs'
                    },
                    {
                        $match: {
                            'inputs.inputId': query.inputId
                        }
                    },
                    {
                        $group: group
                    },
                    {
                        $sort: {
                            'date': 1
                        }
                    },
                    {
                        $project: {
                            '_id': 0,
                            'date': 1,
                            'value': 1,
                            'inputId': 1,
                            'deviceId': 1
                        }
                    }
                ];
            }
        }
    }
};

var isCounter = (query, devices) => {
    query.counter = false;
    devices.map(device => {
        if (device.deviceId == query.deviceId) {
            device.inputs.map(input => {
                if (input.inputId == query.inputId) {
                    if (input.type == 'analog') {
                        var counters = ['CI1', 'CI2', 'CI3', 'CI4', 'CI5', 'CI6', 'CI7', 'CI8'];
                        if (counters.includes(input.analog.key)) {
                            query.counter = true;
                        } else {
                            query.counter = false;
                        };
                    } else if (input.type == 'digital') {
                        query.counter = false;
                    };
                };
            });
        };
    });

    return query;
};