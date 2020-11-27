import { Row } from 'src/app/interfaces/row';
import { Column } from 'src/app/interfaces/column';
import { ObjectId } from 'src/app/id';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTabGroup } from '@angular/material/tabs';
import { AddRowDialog } from './add-row/add-row.dialog';
import { ToastService } from 'src/app/services/toast/toast.service';
import { HistoryService } from 'src/app/services/history/history.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ActivatedRoute } from '@angular/router';
import { ColumnSetupComponent } from './setup/setup.component';
import { ColumnStyleComponent } from './style/style.component';
import { ReportSettingsDialog } from './settings/settings.dialog';
import { ColumnConditionsComponent } from './conditions/conditions.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { OnInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { Report, REPORT, ReportLayout, ReportSettings } from 'src/app/utilities/report';
import { BloxMap, BloxText, BloxBlank, BloxChart, BloxGauge, BloxValue, BloxParse, BloxVector, BloxDefault, BloxUnparse, BloxComponent, BloxRow, BLOXROW } from '@bitid/blox';

@Component({
    selector: 'report-editor-page',
    styleUrls: ['./editor.page.scss'],
    templateUrl: './editor.page.html'
})

export class ReportEditorPage implements OnInit, OnDestroy {

    @ViewChild(MatSidenav, { 'static': true }) public sidenav: MatSidenav;
    @ViewChild(MatTabGroup, { 'static': true }) public tabs: MatTabGroup;
    @ViewChild(BloxComponent, { 'static': true }) public blox: BloxComponent;
    @ViewChild(ColumnSetupComponent, { 'static': true }) private setup: ColumnSetupComponent;
    @ViewChild(ColumnStyleComponent, { 'static': true }) private style: ColumnStyleComponent;
    @ViewChild(ColumnConditionsComponent, { 'static': true }) private conditions: ColumnConditionsComponent;

    constructor(private route: ActivatedRoute, private toast: ToastService, private dialog: MatDialog, private service: ReportsService, public history: HistoryService, public devices: DevicesService) { };

    public rowId: string;
    public report: REPORT = new Report();
    public layout: string = 'desktop';
    public copying: boolean;
    public loading: boolean;
    public editing: boolean = true;
    public reportId: string;
    public resizing: boolean = false;
    public columnId: string;
    private clipboard: any;
    private subscriptions: any = {};

    public unselect() {
        this.rowId = null;
        this.columnId = null;
        this.tabs.selectedIndex = 0;

        this.setup.reset();
        this.style.reset();
        this.conditions.reset();

        this.sidenav.close();
    };

    public async add() {
        this.unselect();
        
        const dialog = await this.dialog.open(AddRowDialog, {
            'data': this.layout,
            'panelClass': 'share-dialog',
            'disableClose': true
        });

        await dialog.afterClosed().subscribe(async count => {
            if (count) {
                let row = new BloxRow({
                    'id': ObjectId(),
                    'height': 100,
                    'columns': [],
                    'position': this.report.layout[this.layout].length
                });

                for (let i = 0; i < count; i++) {
                    let item = new BloxBlank({
                        'id': ObjectId(),
                        'fill': this.report.settings.fill,
                        'font': this.report.settings.font,
                        'width': 100 / count,
                        'stroke': this.report.settings.stroke,
                        'banner': this.report.settings.banner,
                        'position': i + 1
                    });
                    row.columns.push(item);
                };
                this.report.layout[this.layout].push(row);
                this.save({
                    'layout': this.report.layout
                });
            };
        });
    };

    public CancelCopy() {
        this.copying = false;
        this.columnId = null;
        this.clipboard = null;
    };

    public copy(column) {
        this.unselect();
        this.copying = true;
        this.columnId = column.id;
        this.clipboard = JSON.parse(JSON.stringify(column));
        delete this.clipboard.id;
        delete this.clipboard.width;
        delete this.clipboard.position;
    };

    public paste(column) {
        this.clipboard.id = ObjectId();
        Object.keys(this.clipboard).map(key => {
            column[key] = this.clipboard[key]
        });
        this.copying = false;
        this.columnId = null;
        this.clipboard = null;
        this.unselect();

        this.save({
            'layout': this.report.layout
        });
    };

    private async load() {
        this.loading = true;

        const report = await this.service.get({
            'filter': [
                'role',
                'layout',
                'settings',
                'description'
            ],
            'reportId': this.reportId
        });

        if (report.ok) {
            let data = report.result;
            data.layout.mobile = data.layout.mobile.map(row => new BloxRow(row));
            data.layout.mobile.map(row => {
                row.columns = BloxParse(row.columns);
            });
            data.layout.tablet = data.layout.tablet.map(row => new BloxRow(row));
            data.layout.tablet.map(row => {
                row.columns = BloxParse(row.columns);
            });
            data.layout.desktop = data.layout.desktop.map(row => new BloxRow(row));
            data.layout.desktop.map(row => {
                row = new BloxRow(row);
                row.columns = BloxParse(row.columns);
            });
            this.report.role = data.role;
            this.report.layout = data.layout;
            this.report.settings = new ReportSettings(data.settings);
            this.report.description = data.description;
        } else {
            this.toast.error(report.error.message);
            this.history.back();
        };

        const devices = await this.devices.list({
            'filter': [
                'role',
                'inputs',
                'deviceId',
                'description'
            ],
            'sort': {
                'description': 1
            }
        });

        if (devices.ok) {
            this.devices.data = devices.result;
        } else {
            this.devices.data = [];
        };

        this.loading = false;
    };

    public async settings() {
        const dialog = await this.dialog.open(ReportSettingsDialog, {
            'data': this.report.settings,
            'panelClass': 'fullscreen-dialog',
            'disableClose': true
        });

        await dialog.afterClosed().subscribe(async settings => {
            if (settings) {
                this.report.settings = new ReportSettings(settings);
                this.save({
                    'settings': this.report.settings
                });
            };
        });
    };

    public async save(params) {
        params.reportId = this.reportId;

        if (typeof (params.layout) != 'undefined' && params.layout !== null) {
            params.layout = JSON.parse(JSON.stringify(params.layout));
            params.layout.mobile.map(row => {
                row.columns = row.columns.map(column => {
                    column.fill = column.default.fill;
                    column.font = column.default.font;
                    column.banner = column.default.banner;
                    column.stroke = column.default.stroke;
                    delete column.default;
                    return column;
                });
            });
            params.layout.tablet.map(row => {
                row.columns = row.columns.map(column => {
                    column.fill = column.default.fill;
                    column.font = column.default.font;
                    column.banner = column.default.banner;
                    column.stroke = column.default.stroke;
                    delete column.default;
                    return column;
                });
            });
            params.layout.desktop.map(row => {
                row.columns = row.columns.map(column => {
                    column.fill = column.default.fill;
                    column.font = column.default.font;
                    column.banner = column.default.banner;
                    column.stroke = column.default.stroke;
                    delete column.default;
                    return column;
                });
            });
            params.layout.mobile.map(row => {
                row.columns = BloxUnparse(row.columns);
            });
            params.layout.tablet.map(row => {
                row.columns = BloxUnparse(row.columns);
            });
            params.layout.desktop.map(row => {
                row.columns = BloxUnparse(row.columns);
            });
        };

        const response = await this.service.update(params);

        if (!response.ok) {
            this.toast.error(response.error.message);
        };
    };

    public async extend(row: Row) {
        const limit = {
            'mobile': 2,
            'tablet': 5,
            'desktop': 8
        };

        if (row.columns.length < limit[this.layout]) {
            const width = 100 / (row.columns.length + 1);
            row.columns.map(column => {
                column.width = width;
            });
            row.columns.push(new BloxBlank({
                'fill': this.report.settings.fill,
                'width': width,
                'position': row.columns.length + 1
            }));
            this.save({
                'layout': this.report.layout
            });
        } else {
            this.toast.error('row is full!');
        };
    };

    public left(row: BLOXROW, column: Column) {
        moveItemInArray(row.columns, column.position - 1, column.position - 2);
        for (let b = 0; b < row.columns.length; b++) {
            row.columns[b].position = b + 1;
        };
    };

    public right(row: BLOXROW, column: Column) {
        moveItemInArray(row.columns, column.position - 1, column.position);
        for (let b = 0; b < row.columns.length; b++) {
            row.columns[b].position = b + 1;
        };
    };

    public select(row: BLOXROW, column: Column) {
        this.rowId = row.id;
        this.columnId = column.id;

        this.setup.set(column);
        this.style.set(column);
        this.conditions.set(column);

        this.sidenav.open();
    };

    public remove(event, row: BLOXROW, columnId) {
        event.preventDefault();
        event.stopPropagation();
        if (row.columns.length > 1) {
            row.columns = row.columns.sort((a, b) => {
                if (a.position < b.position) {
                    return -1;
                } else if (a.position > b.position) {
                    return 1;
                } else {
                    return 0;
                };
            });
            let width: number = 0;
            for (let i = 0; i < row.columns.length; i++) {
                if (row.columns[i].id == columnId) {
                    width = row.columns[i].width;
                    row.columns.splice(i, 1);
                    break;
                };
            };

            row.columns.map(column => {
                column.width += parseFloat((width / row.columns.length).toFixed(2));
            });
            for (let i = 0; i < row.columns.length; i++) {
                row.columns[i].position = i + 1;
            }
        } else {
            for (let i = 0; i < this.report.layout[this.layout].length; i++) {
                if (this.report.layout[this.layout][i].id == row.id) {
                    this.report.layout[this.layout].splice(i, 1);
                    break;
                };
            };
        };
        this.unselect();

        this.save({
            'layout': this.report.layout
        });
    };

    public reorder(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.report.layout[this.layout], event.previousIndex, event.currentIndex);
        for (let a = 0; a < this.report.layout[this.layout].length; a++) {
            this.report.layout[this.layout][a].position = a + 1;
            for (let b = 0; b < this.report.layout[this.layout][a].columns.length; b++) {
                this.report.layout[this.layout][a].columns[b].position = b + 1;
            };
        };
        this.save({
            'layout': this.report.layout
        });
    };

    ngOnInit(): void {
        this.subscriptions.route = this.route.queryParams.subscribe(params => {
            this.reportId = params.reportId;
            this.load();
        });

        this.subscriptions.setup = this.setup.change.subscribe(setup => {
            for (let a = 0; a < this.report.layout[this.layout].length; a++) {
                if (this.report.layout[this.layout][a].id == this.rowId) {
                    for (let b = 0; b < this.report.layout[this.layout][a].columns.length; b++) {
                        if (this.report.layout[this.layout][a].columns[b].id == this.columnId) {
                            const item = this.report.layout[this.layout][a].columns[b];
                            if (item.type == 'value') {
                                const current = [setup.deviceId, setup.inputId, setup.expression].join('-');
                                const previous = [item.deviceId, item.inputId, item.expression].join('-');
                                if (current != previous) {
                                    let valid = true;
                                    const fields = [setup.deviceId, setup.inputId, setup.expression];
                                    fields.map(field => {
                                        if (typeof (field) == 'undefined' || field == null) {
                                            valid = false;
                                        };
                                    });
                                    if (valid) {
                                        debugger
                                    };
                                };
                            } else if (this.report.layout[this.layout][a].columns[b].type == 'chart') {
                                this.report.layout[this.layout][a].columns[b].series.map(async series => {
                                    series.data = [
                                        {
                                            'x': new Date(),
                                            'y': 0
                                        },
                                        {
                                            'x': new Date(),
                                            'y': 10
                                        },
                                        {
                                            'x': new Date(),
                                            'y': 0
                                        }
                                    ];
                                });
                            };

                            Object.keys(setup).map(key => {
                                if (this.report.layout[this.layout][a].columns[b].type != setup.type) {
                                    switch (setup.type) {
                                        case ('map'):
                                            this.report.layout[this.layout][a].columns[b] = new BloxMap(this.report.layout[this.layout][a].columns[b]);
                                            break;
                                        case ('text'):
                                            this.report.layout[this.layout][a].columns[b] = new BloxText(this.report.layout[this.layout][a].columns[b]);
                                            break;
                                        case ('blank'):
                                            this.report.layout[this.layout][a].columns[b] = new BloxBlank(this.report.layout[this.layout][a].columns[b]);
                                            break;
                                        case ('value'):
                                            this.report.layout[this.layout][a].columns[b] = new BloxValue(this.report.layout[this.layout][a].columns[b]);
                                            break;
                                        case ('chart'):
                                            this.report.layout[this.layout][a].columns[b] = new BloxChart(this.report.layout[this.layout][a].columns[b]);
                                            break;
                                        case ('gauge'):
                                            this.report.layout[this.layout][a].columns[b] = new BloxGauge(this.report.layout[this.layout][a].columns[b]);
                                            break;
                                        case ('vector'):
                                            this.report.layout[this.layout][a].columns[b] = new BloxVector(this.report.layout[this.layout][a].columns[b]);
                                            break;
                                    };
                                } else {
                                    this.report.layout[this.layout][a].columns[b][key] = setup[key];
                                };
                            });
                        };
                    };
                };
            };
        });

        this.subscriptions.style = this.style.change.subscribe(style => {
            for (let a = 0; a < this.report.layout[this.layout].length; a++) {
                if (this.report.layout[this.layout][a].id == this.rowId) {
                    for (let b = 0; b < this.report.layout[this.layout][a].columns.length; b++) {
                        if (this.report.layout[this.layout][a].columns[b].id == this.columnId) {
                            Object.keys(style).map(key => {
                                this.report.layout[this.layout][a].columns[b][key] = style[key];
                            });
                            this.report.layout[this.layout][a].columns[b].default = new BloxDefault(style);
                        };
                    };
                };
            };
        });

        this.subscriptions.changes = this.blox.changes.subscribe(rows => {
            rows.map(row => {
                for (let a = 0; a < this.report.layout[this.layout].length; a++) {
                    if (this.report.layout[this.layout][a].id == row.id) {
                        this.report.layout[this.layout][a].height = row.height;
                        row.columns.map(column => {
                            for (let b = 0; b < this.report.layout[this.layout][a].columns.length; b++) {
                                if (this.report.layout[this.layout][a].columns[b].id == column.id) {
                                    this.report.layout[this.layout][a].columns[b].width = column.width;
                                };
                            };
                        });
                    };
                };
            });
            this.save({
                'layout': this.report.layout
            });
        });

        this.subscriptions.preview = this.conditions.preview.subscribe(preview => {
            this.report.layout[this.layout].map(row => {
                row.columns.map(column => {
                    Object.keys(column.default).map(key => {
                        column[key] = column.default[key];
                    });
                });
            });
            if (preview) {
                this.report.layout[this.layout].map(row => {
                    if (row.id == this.rowId) {
                        row.columns.map(column => {
                            if (column.id == this.columnId) {
                                column.fill = preview.fill;
                                column.font = preview.font;
                                column.banner = preview.banner;
                                column.stroke = preview.stroke;
                            };
                        });
                    };
                });
            };
        });

        this.subscriptions.conditions = this.conditions.change.subscribe(data => {
            this.report.layout[this.layout].map(row => {
                if (row.id == this.rowId) {
                    row.columns.map(column => {
                        if (column.id == this.columnId) {
                            column.conditions = data.conditions;
                        };
                    });
                };
            });

            this.save({
                'layout': this.report.layout
            });
        });

        this.subscriptions.update_setup = this.setup.update.subscribe(setup => {
            this.report.layout[this.layout].map(row => {
                if (row.id == this.rowId) {
                    row.columns.map(column => {
                        if (column.id == this.columnId) {
                            Object.keys(setup).map(key => {
                                if (column.type != setup.type) {
                                    switch (setup.type) {
                                        case ('map'):
                                            column = new BloxMap(column);
                                            break;
                                        case ('text'):
                                            column = new BloxText(column);
                                            break;
                                        case ('blank'):
                                            column = new BloxBlank(column);
                                            break;
                                        case ('value'):
                                            column = new BloxValue(column);
                                            break;
                                        case ('chart'):
                                            column = new BloxChart(column);
                                            break;
                                        case ('gauge'):
                                            column = new BloxGauge(column);
                                            break;
                                        case ('vector'):
                                            column = new BloxVector(column);
                                            break;
                                    };
                                } else {
                                    column[key] = setup[key];
                                };
                            });
                        };
                    });
                };
            });

            this.save({
                'layout': this.report.layout
            });
        });

        this.subscriptions.update_style = this.style.update.subscribe(style => {
            this.report.layout[this.layout].map(row => {
                if (row.id == this.rowId) {
                    row.columns.map(column => {
                        if (column.id == this.columnId) {
                            Object.keys(style).map(key => {
                                column[key] = style[key];
                                column.default[key] = style[key];
                            });
                        };
                    });
                };
            });

            this.save({
                'layout': this.report.layout
            });
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.route.unsubscribe();
        this.subscriptions.setup.unsubscribe();
        this.subscriptions.style.unsubscribe();
        this.subscriptions.changes.unsubscribe();
        this.subscriptions.preview.unsubscribe();
        this.subscriptions.update_setup.unsubscribe();
        this.subscriptions.update_style.unsubscribe();
    };

}