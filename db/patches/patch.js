class BloxRow {

    constructor(item) {
        this.id = item.id || ObjectId();
        this.height = item.height || 0;
        this.columns = item.columns || [];
        this.position = item.position || 0;
    };

}

class BloxFill {

    constructor(item) {
        this.color = item.color || '#000000';
        this.opacity = item.opacity || 100;
    };

}

class BloxFont {

    constructor(item) {
        this.size = item.size || 14;
        this.color = item.color || '#000000';
        this.family = item.family || 'Arial';
        this.opacity = item.opacity || 100;
        this.vertical = item.vertical || 'center';
        this.horizontal = item.horizontal || 'center';
    };

}

class BloxStyle {

    constructor(item) {
        this.id = item.id || ObjectId();
        this.fill = new BloxFill(item.fill);
        this.font = new BloxFont(item.font);
        this.label = item.label || null;
        this.width = item.width || 0;
        this.stroke = new BloxStroke(item.stroke);
        this.banner = new BloxBanner(item.banner);
        this.position = item.position || 0;
        this.conditions = (item.conditions || []).map(condition => new BloxCondition(condition));
    };

}

class BloxStroke {

    constructor(item) {
        this.width = item.width || 0;
        this.style = item.style || 'solid';
        this.color = item.color || '#000000';
        this.opacity = item.opacity || 100;
    };

}

class BloxSeries {

    constructor(item) {
        this.id = item.id || ObjectId();
        this.type = item.type || null;
        this.color = item.color || '#000000';
        this.label = item.label || null;
        this.opacity = item.opacity || 100;
        this.inputId = item.inputId || null;
        this.deviceId = item.deviceId || null;
    };

}

class BloxBanner {

    constructor(item) {
        this.size = item.size || 14;
        this.color = item.color || '#000000';
        this.family = item.family || 'Arial';
        this.opacity = item.opacity || 100;
        this.vertical = item.vertical || 'center';
        this.horizontal = item.horizontal || 'center';
    };

}

class BloxCondition {
    
    constructor(item) {
        this.analog = {
            'min': 0,
            'max': 0
        };
        this.digital = {
            'value': 0
        };
        this.id = item.id || ObjectId();
        this.fill = new BloxFill(item.fill);
        this.font = new BloxFont(item.font);
        this.type = item.type || null;
        this.stroke = new BloxStroke(item.stroke);
        this.banner = new BloxBanner(item.banner);
        this.inputId = item.inputId || null;
        this.deviceId = item.deviceId || null;
        if (this.type == 'analog') {
            this.analog.min = item.analog.min || 0;
            this.analog.max = item.analog.max || 0;
        };
        if (this.type == 'digital') {
            this.digital.value = item.digital.value || 0;
        };
    };

}

class BloxText extends BloxStyle  {

    constructor(item) {
        super(item);
        this.type = 'text';
        this.value = item.value || '';
    };

}

class BloxChart extends BloxStyle {

    constructor(item) {
        super(item);
        this.type = 'chart';
        this.series = (item.series || []).map(o => new BloxSeries(o));
    };

}

class BloxValue extends BloxStyle {

    constructor(item) {
        super(item);
        this.type = 'value';
        this.inputId = item.inputId || null;
        this.deviceId = item.deviceId || null;
        this.expression = item.expression || null;
    };

}

class BloxBlank extends BloxStyle {

    constructor(item) {
        super(item);
        this.type = 'blank';
    };

}

db.tblReports.find({}, {
    '_id': 1,
    'layout': 1
}).forEach(report => {
    Object.keys(report.layout).map(layout => {
        report.layout[layout] = report.layout[layout].map(row => new BloxRow(row));
        for (let a = 0; a < report.layout[layout].length; a++) {
            for (let b = 0; b < report.layout[layout][a].columns.length; b++) {
                report.layout[layout][a].columns[b].type = report.layout[layout][a].columns[b].display;
                if (report.layout[layout][a].columns[b].query) {
                    report.layout[layout][a].columns[b].inputId = report.layout[layout][a].columns[b].query.inputId;
                    report.layout[layout][a].columns[b].deviceId = report.layout[layout][a].columns[b].query.deviceId;
                };
                if (report.layout[layout][a].columns[b].value) {
                    report.layout[layout][a].columns[b].expression = report.layout[layout][a].columns[b].value.expression;
                };
                report.layout[layout][a].columns[b].conditions = [];
                
                switch (report.layout[layout][a].columns[b].type) {
                    case ('text'):
                        report.layout[layout][a].columns[b] = new BloxText(report.layout[layout][a].columns[b]);
                        break;
                    case ('chart'):
                        report.layout[layout][a].columns[b].series = [
                            {
                                'type': report.layout[layout][a].columns[b].chart.type,
                                'color': report.layout[layout][a].columns[b].chartfill.color,
                                'inputId': report.layout[layout][a].columns[b].inputId,
                                'opacity': report.layout[layout][a].columns[b].chartfill.opacity,
                                'deviceId': report.layout[layout][a].columns[b].deviceId
                            }
                        ];
                        report.layout[layout][a].columns[b] = new BloxChart(report.layout[layout][a].columns[b]);
                        break;
                    case ('value'):
                        report.layout[layout][a].columns[b] = new BloxValue(report.layout[layout][a].columns[b]);
                        break;
                    case ('spacer'):
                        report.layout[layout][a].columns[b] = new BloxBlank(report.layout[layout][a].columns[b]);
                        break;
                    default:
                        report.layout[layout][a].columns[b] = null;
                        break;
                };
            };
        };
    });
    
    db.tblReports.update({
        '_id': report._id
    }, {
        $set: {
            'layout': report.layout,
            'settings': {
                "fill":{
                    "color":"#ffffff",
                    "opacity":25
                },
                "font":{
                    "size":24,
                    "color":"#ffffff",
                    "family":"Arial",
                    "opacity":100,
                    "vertical":"center",
                    "horizontal":"center"
                },
                "board":{
                    "color":"#000000",
                    "opacity":100
                },
                "stroke":{
                    "width":0,
                    "style":"solid",
                    "color":"#ffffff",
                    "opacity":100
                },
                "banner":{
                    "size":14,
                    "color":"#FFFFFF",
                    "family":"Arial",
                    "opacity":100,
                    "vertical":"top",
                    "horizontal":"left"
                }
            }
        },
        $unset: {
            "type": true
        }
    });
});