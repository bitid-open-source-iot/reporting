var max = 31;
var days = [1, 0, 0, 1, 1, 1, 1]; // 7 days into the month
var total = days.reduce((a, b) => a + b);
var average = total / days.length;
var prediction = average * max;