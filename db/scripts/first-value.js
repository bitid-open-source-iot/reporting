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
                "year": {
                   $year: "$date"
                },
                "month": {
                   $month: "$date"
                }
           },
           "value": {
               $first: "$value"
           }
        }
    }
]);