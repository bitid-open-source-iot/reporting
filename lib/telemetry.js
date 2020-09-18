const ObjectId = require("mongodb").ObjectId;

exports.historical = {
    inputs: {
        data: (query) => {
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
                       $year: '$serverDate'
                    },
                    'month': {
                       $month: '$serverDate'
                    },
                    'day': {
                       $dayOfMonth: '$serverDate'
                    },
                    'hour': {
                       $hour: '$serverDate'
                    },
                    'minute': {
                       $minute: '$serverDate'
                    },
                    'inputId': '$inputs.inputId',
                    'deviceId': '$deviceId'
                },
                'type': {
                    $first: '$inputs.type'
                },
                'analog': {
                    $first: '$inputs.analog'
                },
                'digital': {
                    $first: '$inputs.digital'
                },
                'inputId': {
                    $first: '$inputs.inputId'
                },
                'deviceId': {
                    $first: '$deviceId'
                },
                'date': {
                    $first: '$serverDate'
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
                        'serverDate': {
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
                }
            ];
        },
        value: {
            last: (query) => {
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
                           $year: '$serverDate'
                        },
                        'month': {
                           $month: '$serverDate'
                        },
                        'day': {
                           $dayOfMonth: '$serverDate'
                        },
                        'hour': {
                           $hour: '$serverDate'
                        },
                        'minute': {
                           $minute: '$serverDate'
                        },
                        'inputId': '$inputs.inputId',
                        'deviceId': '$deviceId'
                    },
                    'value': {
                       $last: '$inputs.value'
                    }
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
                            'serverDate': {
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
                    }
                ];
            },
            first: (query) => {
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
                           $year: '$serverDate'
                        },
                        'month': {
                           $month: '$serverDate'
                        },
                        'day': {
                           $dayOfMonth: '$serverDate'
                        },
                        'hour': {
                           $hour: '$serverDate'
                        },
                        'minute': {
                           $minute: '$serverDate'
                        },
                        'inputId': '$inputs.inputId',
                        'deviceId': '$deviceId'
                    },
                    'value': {
                       $first: '$inputs.value'
                    }
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
                            'serverDate': {
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
                    }
                ];
            },
            predict: (query) => {
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
                           $year: '$serverDate'
                        },
                        'month': {
                           $month: '$serverDate'
                        },
                        'day': {
                           $dayOfMonth: '$serverDate'
                        },
                        'hour': {
                           $hour: '$serverDate'
                        },
                        'minute': {
                           $minute: '$serverDate'
                        },
                        'inputId': '$inputs.inputId',
                        'deviceId': '$deviceId'
                    },
                    'type': {
                        $first: '$inputs.type'
                    },
                    'analog': {
                        $first: '$inputs.analog'
                    },
                    'digital': {
                        $first: '$inputs.digital'
                    },
                    'inputId': {
                        $first: '$inputs.inputId'
                    },
                    'deviceId': {
                        $first: '$deviceId'
                    },
                    'date': {
                        $first: '$serverDate'
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
                            'serverDate': {
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
                    }
                ];
            }
        }
    }
};