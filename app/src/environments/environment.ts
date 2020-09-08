export const environment = {
    "auth": "https://auth.bitid.co.za",
    "drive": "https://drive.bitid.co.za",
    "appId": "000000000000000000000002",
    "appName": "Reporting",
    "reporting": "http://127.0.0.1:2000",
    // "reporting": "https://reporting.bitid.co.za",
    "production": false,
    "roles": [
        { "value": 1, "title": "Read Only" },
        { "value": 2, "title": "Write Only" },
        { "value": 3, "title": "Read/Write" },
        { "value": 4, "title": "Admin" },
        { "value": 5, "title": "Owner" }
    ],
    "scopes": [
        { "url": "/users/get", "role": 4 },
        { "url": "/users/update", "role": 4 },

        { "url": "/drive/files/upload", "role": 4 },

        { "url": "/reporting/reports/add", "role": 4 },
        { "url": "/reporting/reports/get", "role": 4 },
        { "url": "/reporting/reports/list", "role": 4 },
        { "url": "/reporting/reports/share", "role": 4 },
        { "url": "/reporting/reports/update", "role": 4 },
        { "url": "/reporting/reports/delete", "role": 4 },
        { "url": "/reporting/reports/unsubscribe", "role": 4 },
        { "url": "/reporting/reports/updatesubscriber", "role": 4 }
    ]
};