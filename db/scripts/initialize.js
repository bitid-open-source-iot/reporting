var reports = db.getCollection("tblReports");
if (reports.count() == 0) {
    db.tblReports.insert({
        "bitid": {
            "auth": {
                "users": [
                    {
                        "role":  NumberInt("5"),
                        "email": "xxx@xxx.co.za"
                    }
                ],
                "organizationOnly": NumberInt("0")
            }
        },
        "query": {
            "body":   [],
            "method": "GET"
        },
        "_id":         ObjectId("000000000000000000000001"),
        "url":         "https://...",
        "type":        "ds",
        "serverDate":   ISODate(),
        "description":  "My First Report"
    });
};

var schedule = db.getCollection("tblSchedule");
if (schedule.count() == 0) {
    db.tblSchedule.insert({
        "bitid": {
            "auth": {
                "users": [
                    {
                        "role":  NumberInt("5"),
                        "email": "xxx@xxx.co.za"
                    }
                ],
                "organizationOnly": NumberInt("0")
            }
        },
        "trigger": {
            "hour":     0,
            "date":     0,
            "year":     0,
            "month":    0,
            "minute":   0
        },
        "recipients": [
            {
                "email": "xxx@xxx.co.za"
            }
        ],
        "_id":          ObjectId("000000000000000000000001"),
        "last":         "2020-01-01T00:00:00.000Z",
        "cycle":        "daily", // hourly, daily, weekly, monthly, quarterly, bi-annually, annually
        "offset":       0,
        "reportId":     "000000000000000000000001",
        "serverDate":   ISODate(),
        "description":  "My First Report Schedule"
    });
};