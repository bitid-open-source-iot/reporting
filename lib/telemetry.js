const dates = require("./dates");
const ObjectId = require("mongodb").ObjectId;

exports.historical = {
    inputs: {
        data: (query) => {
            query.date = {
                'to': new Date(),
                'from': new Date()
            };

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

            switch(query.range) {
                case('current-day'):
                    query.date.to = dates.current.day().to;
                    query.date.from = dates.current.day().from;
                    break;
                case('previous-day'):
                    query.date.to = dates.previous.day().to;
                    query.date.from = dates.previous.day().from;
                    break;
                case('current-week'):
                    query.date.to = dates.current.week().to;
                    query.date.from = dates.current.week().from;
                    break;
                case('previous-week'):
                    query.date.to = dates.previous.week().to;
                    query.date.from = dates.previous.week().from;
                    break;
                case('current-month'):
                    query.date.to = dates.current.month().to;
                    query.date.from = dates.current.month().from;
                    break;
                case('previous-month'):
                    query.date.to = dates.previous.month().to;
                    query.date.from = dates.previous.month().from;
                    break;
                case('current-year'):
                    query.date.to = dates.current.year().to;
                    query.date.from = dates.current.year().from;
                    break;
                case('previous-year'):
                    query.date.to = dates.previous.year().to;
                    query.date.from = dates.previous.year().from;
                    break;
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
                    $project: {
                        '_id': 0,
                        'date': '$inputs.date',
                        'value': '$inputs.value'
                    }
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
                query.date = {
                    'to': new Date(),
                    'from': new Date()
                };

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

                switch(query.range) {
                    case('current-day'):
                        query.date.to = dates.current.day().to;
                        query.date.from = dates.current.day().from;
                        break;
                    case('previous-day'):
                        query.date.to = dates.previous.day().to;
                        query.date.from = dates.previous.day().from;
                        break;
                    case('current-week'):
                        query.date.to = dates.current.week().to;
                        query.date.from = dates.current.week().from;
                        break;
                    case('previous-week'):
                        query.date.to = dates.previous.week().to;
                        query.date.from = dates.previous.week().from;
                        break;
                    case('current-month'):
                        query.date.to = dates.current.month().to;
                        query.date.from = dates.current.month().from;
                        break;
                    case('previous-month'):
                        query.date.to = dates.previous.month().to;
                        query.date.from = dates.previous.month().from;
                        break;
                    case('current-year'):
                        query.date.to = dates.current.year().to;
                        query.date.from = dates.current.year().from;
                        break;
                    case('previous-year'):
                        query.date.to = dates.previous.year().to;
                        query.date.from = dates.previous.year().from;
                        break;
                };
                
                var group = {
                    '_id': {
                        'y': {
                           $year: '$date'
                        },
                        'm': {
                           $month: '$date'
                        },
                        'd': {
                           $dayOfMonth: '$date'
                        },
                        'h': {
                           $dayOfMonth: '$date'
                        }
                    },
                    'value': {
                       $last: '$value'
                    }
                };

                switch(query.range) {
                    case('current-day'):
                    case('previous-day'):
                        break;
                    case('current-week'):
                    case('previous-week'):
                        delete group._id.h;
                        break;
                    case('current-month'):
                    case('previous-month'):
                        delete group._id.d;
                        delete group._id.h;
                        break;
                    case('current-year'):
                    case('previous-year'):
                        delete group._id.m;
                        delete group._id.d;
                        delete group._id.h;
                        break;
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
                        $project: {
                            '_id': 0,
                            'date': '$inputs.date',
                            'value': '$inputs.value'
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
                query.date = {
                    'to': new Date(),
                    'from': new Date()
                };

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

                switch(query.range) {
                    case('current-day'):
                        query.date.to = dates.current.day().to;
                        query.date.from = dates.current.day().from;
                        break;
                    case('previous-day'):
                        query.date.to = dates.previous.day().to;
                        query.date.from = dates.previous.day().from;
                        break;
                    case('current-week'):
                        query.date.to = dates.current.week().to;
                        query.date.from = dates.current.week().from;
                        break;
                    case('previous-week'):
                        query.date.to = dates.previous.week().to;
                        query.date.from = dates.previous.week().from;
                        break;
                    case('current-month'):
                        query.date.to = dates.current.month().to;
                        query.date.from = dates.current.month().from;
                        break;
                    case('previous-month'):
                        query.date.to = dates.previous.month().to;
                        query.date.from = dates.previous.month().from;
                        break;
                    case('current-year'):
                        query.date.to = dates.current.year().to;
                        query.date.from = dates.current.year().from;
                        break;
                    case('previous-year'):
                        query.date.to = dates.previous.year().to;
                        query.date.from = dates.previous.year().from;
                        break;
                };
                
                var group = {
                    '_id': {
                        'y': {
                           $year: '$date'
                        },
                        'm': {
                           $month: '$date'
                        },
                        'd': {
                           $dayOfMonth: '$date'
                        },
                        'h': {
                           $dayOfMonth: '$date'
                        }
                    },
                    'value': {
                       $last: '$value'
                    }
                };

                switch(query.range) {
                    case('current-day'):
                    case('previous-day'):
                        break;
                    case('current-week'):
                    case('previous-week'):
                        delete group._id.h;
                        break;
                    case('current-month'):
                    case('previous-month'):
                        delete group._id.d;
                        delete group._id.h;
                        break;
                    case('current-year'):
                    case('previous-year'):
                        delete group._id.m;
                        delete group._id.d;
                        delete group._id.h;
                        break;
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
                        $project: {
                            '_id': 0,
                            'date': '$inputs.date',
                            'value': '$inputs.value'
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
                query.date = {
                    'to': new Date(),
                    'from': new Date()
                };

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

                switch(query.range) {
                    case('current-day'):
                        query.date.to = dates.current.day().to;
                        query.date.from = dates.current.day().from;
                        break;
                    case('previous-day'):
                        query.date.to = dates.previous.day().to;
                        query.date.from = dates.previous.day().from;
                        break;
                    case('current-week'):
                        query.date.to = dates.current.week().to;
                        query.date.from = dates.current.week().from;
                        break;
                    case('previous-week'):
                        query.date.to = dates.previous.week().to;
                        query.date.from = dates.previous.week().from;
                        break;
                    case('current-month'):
                        query.date.to = dates.current.month().to;
                        query.date.from = dates.current.month().from;
                        break;
                    case('previous-month'):
                        query.date.to = dates.previous.month().to;
                        query.date.from = dates.previous.month().from;
                        break;
                    case('current-year'):
                        query.date.to = dates.current.year().to;
                        query.date.from = dates.current.year().from;
                        break;
                    case('previous-year'):
                        query.date.to = dates.previous.year().to;
                        query.date.from = dates.previous.year().from;
                        break;
                };

                var group = {
                    '_id': {
                        'y': {
                           $year: '$date'
                        },
                        'm': {
                           $month: '$date'
                        },
                        'd': {
                           $dayOfMonth: '$date'
                        },
                        'h': {
                           $dayOfMonth: '$date'
                        }
                    },
                    'value': {
                       $last: '$value'
                    }
                };

                switch(query.range) {
                    case('current-day'):
                    case('previous-day'):
                        break;
                    case('current-week'):
                    case('previous-week'):
                        delete group._id.h;
                        break;
                    case('current-month'):
                    case('previous-month'):
                        delete group._id.d;
                        delete group._id.h;
                        break;
                    case('current-year'):
                    case('previous-year'):
                        delete group._id.m;
                        delete group._id.d;
                        delete group._id.h;
                        break;
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
                        $project: {
                            '_id': 0,
                            'date': '$inputs.date',
                            'value': '$inputs.value'
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