export const environment = {
    "auth":             "https://auth.bitid.co.za",
    "appName":          "reporting",
    "reporting":        "https://reporting.bitid.co.za",
    "production":       true,
    "appId":     "000000000000000000000005",
    "scopes":[
        {'url':'/reporting/reports/add','role':4},
        {'url':'/reporting/reports/get','role':4},
        {'url':'/reporting/reports/list','role':4},
        {'url':'/reporting/reports/share','role':4},
        {'url':'/reporting/reports/update','role':4},
        {'url':'/reporting/reports/delete','role':4},
        {'url':'/reporting/reports/unsubscribe','role':4},
        {'url':'/reporting/reports/updatesubscriber','role':4},
    ],
    "roles": [
        {
            "value":        1,
            "description":  "Read"
        },
        {
            "value":        2,
            "description":  "Write"
        },
        {
            "value":        3,
            "description":  "Read/Write"
        },
        {
            "value":        4,
            "description":  "Admin"
        },
        {
            "value":        5,
            "description":  "Owner"
        }
    ],
    "organizationOnly": [
        {
            "value":        0,
            "description":  "Anyone Can Share"
        },
        {
            "value":        1,
            "description":  "Organization Only"
        }
    ]
};