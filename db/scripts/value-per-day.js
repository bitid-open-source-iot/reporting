db.tblHistorical.aggregate([
    {
        $match: {
            "serverDate": {
                $gte: ISODate("2020-09-01T00:00:00.000Z"),
                $lte: ISODate("2020-09-31T00:00:00.000Z")
            },
            "deviceId": ObjectId("000000000000000012794690")
        }
    },
    {
        $unwind: "$inputs"
    },
    {
        $match: {
            "inputs.inputId": ObjectId("000000000000000000000001")
        }
    },
    {
        $project: {
            "_id": 0,
            "date": "$inputs.date",
            "value": "$inputs.value"
        }
    },
    {
        $group: {
            "_id": {
                "y": {
                   $year: "$date"
                },
                "m": {
                   $month: "$date"
                },
                "d": {
                   $dayOfMonth: "$date"
                }
            },
            "date": {
               $last: "$date"
            },
            "value": {
               $avg: "$value"
            }
        }
    },
    {
        $sort: {
            "date": 1
        }
    },
    {
        $project: {
            "_id": 0,
            "date": 1,
            "value": 1
        }
    }
]);