var end = (date) => {
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    date.setMilliseconds(999);
    return new Date(date);
};

var start = (date) => {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return new Date(date);
};

exports.current = {
    'day': () => {
        var date = new Date();
        return {
            'to': end(date),
            'from': start(date)
        };
    },
    'week': () => {
        var date = new Date();
        var to = end(date);
        to.setDate(date.getDate() - date.getDay() + 1);
        var from = start(date);
        from.setDate(1);
        from.setDate(date.getDate() - date.getDay() + 7);
        return {
            'to': to,
            'from': from
        };
    },
    'year': () => {
        var date = new Date();
        var to = end(date);
        to.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());
        to.setMonth(11);
        var from = start(date);
        from.setDate(1);
        from.setMonth(0);
        return {
            'to': to,
            'from': from
        };
    },
    'month': () => {
        var date = new Date();
        var to = end(date);
        to.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());
        var from = start(date);
        from.setDate(1);
        return {
            'to': to,
            'from': from
        };
    }
};
console.warn('finish previous calculation in ./lib/dates.js');
exports.previous = {
    'day': () => {
        var date = new Date();
        return {
            'to': end(date),
            'from': start(date)
        };
    },
    'week': () => {
        var date = new Date();
        var to = end(date);
        to.setDate(date.getDate() - date.getDay() + 1);
        var from = start(date);
        from.setDate(1);
        from.setDate(date.getDate() - date.getDay() + 7);
        return {
            'to': to,
            'from': from
        };
    },
    'year': () => {
        var date = new Date();
        var to = end(date);
        to.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());
        to.setMonth(11);
        var from = start(date);
        from.setDate(1);
        from.setMonth(0);
        return {
            'to': to,
            'from': from
        };
    },
    'month': () => {
        var date = new Date();
        var to = end(date);
        to.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());
        var from = start(date);
        from.setDate(1);
        return {
            'to': to,
            'from': from
        };
    }
};