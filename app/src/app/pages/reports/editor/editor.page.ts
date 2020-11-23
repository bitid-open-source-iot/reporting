import { Row } from 'src/app/interfaces/row';
import { Column } from 'src/app/interfaces/column';
import { ObjectId } from 'src/app/id';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTabGroup } from '@angular/material/tabs';
import { AddRowDialog } from './add-row/add-row.dialog';
import { ToastService } from 'src/app/services/toast/toast.service';
import { BloxComponent } from 'src/app/lib/blox/blox.component';
import { HistoryService } from 'src/app/services/history/history.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ActivatedRoute } from '@angular/router';
import { Report, REPORT, ReportLayout, ReportSettings } from 'src/app/utilities/report';
import { ColumnSetupComponent } from './setup/setup.component';
import { ColumnStyleComponent } from './style/style.component';
import { ReportSettingsDialog } from './settings/settings.dialog';
import { ColumnConditionsComponent } from './conditions/conditions.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { OnInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { Map, Text, Chart, Value, Blank, Gauge, Vector, ParseUtility, UnparseUtility } from 'src/app/lib/utilities/index';

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

        this.save({
            'layout': this.report.layout
        });
    };

    public async add() {
        const dialog = await this.dialog.open(AddRowDialog, {
            'data': this.layout,
            'panelClass': 'share-dialog',
            'disableClose': true
        });

        await dialog.afterClosed().subscribe(async count => {
            if (count) {
                let row: Row = {
                    'rowId': ObjectId(),
                    'height': 100,
                    'columns': [],
                    'position': this.report.layout[this.layout].length
                };

                for (let i = 0; i < count; i++) {
                    let item = new Blank({
                        'fill': this.report.settings.fill,
                        'width': 100 / count,
                        'position': i + 1
                    });
                    row.columns.push(item);
                };
                debugger
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
            const data = report.result;
            
            data.layout.mobile.map(row => {
                row.columns = ParseUtility(row.columns);
                row.columns.map(async column => {
                    if (column.type == 'value') {
                        
                    } else if (column.type == 'chart') {
                        
                    };
                });
            });
            data.layout.tablet.map(row => {
                row.columns = ParseUtility(row.columns);
                row.columns.map(async column => {
                    if (column.type == 'value') {
                        
                    } else if (column.type == 'chart') {
                        
                    };
                });
            });
            data.layout.desktop.map(row => {
                row.columns = ParseUtility(row.columns);
                row.columns.map(async column => {
                    if (column.type == 'value') {
                        
                    } else if (column.type == 'chart') {
                        
                    };
                });
            });

            this.report.role = data.role;
            this.report.layout = new ReportLayout(data.layout);
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
        
        if (typeof(params.layout) != 'undefined' && params.layout !== null) {
            params.layout = JSON.parse(JSON.stringify(params.layout));
            params.layout.mobile.map(row => {
                row.columns = UnparseUtility(row.columns);
            });
            params.layout.tablet.map(row => {
                row.columns = UnparseUtility(row.columns);
            });
            params.layout.desktop.map(row => {
                row.columns = UnparseUtility(row.columns);
            });
        };

        const response = await this.service.update(params);

        if (!response.ok) {
            this.toast.error(response.error.message);
        };
    };

    public async extend(row: Row) {
        let width = 100 / row.columns.length;
        let subtract = width / row.columns.length;
        row.columns.map(column => {
            column.width -= subtract;
        });
        row.columns.push(new Blank({
            'fill': this.report.settings.fill,
            'width': width,
            'position': row.columns.length + 1
        }));
        this.save({
            'layout': this.report.layout
        });
    };

    public left(row: Row, column: Column) {
        moveItemInArray(row.columns, column.position - 1, column.position - 2);
        for (let b = 0; b < row.columns.length; b++) {
            row.columns[b].position = b + 1;
        };
    };

    public right(row: Row, column: Column) {
        moveItemInArray(row.columns, column.position - 1, column.position);
        for (let b = 0; b < row.columns.length; b++) {
            row.columns[b].position = b + 1;
        };
    };

    public select(row: Row, column: Column) {
        this.rowId = row.rowId;
        this.columnId = column.id;

        this.setup.set(column);
        this.style.set(column);
        this.conditions.set(column);

        this.sidenav.open();
    };

    public remove(event, row: Row, columnId) {
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
                if (this.report.layout[this.layout][i].rowId == row.rowId) {
                    this.report.layout[this.layout].splice(i, 1);
                    break;
                };
            };
        };
        this.unselect();
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
                if (this.report.layout[this.layout][a].rowId == this.rowId) {
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
                                        if (typeof(field) == 'undefined' || field == null) {
                                            valid = false;
                                        };
                                    });
                                    if (valid) {
                                        debugger
                                    };
                                };
                            };
                            Object.keys(setup).map(key => {
                                if (this.report.layout[this.layout][a].columns[b].type != setup.type) {
                                    switch(setup.type) {
                                        case('map'):
                                            this.report.layout[this.layout][a].columns[b] = new Map(this.report.layout[this.layout][a].columns[b]);
                                            break;
                                        case('text'):
                                            this.report.layout[this.layout][a].columns[b] = new Text(this.report.layout[this.layout][a].columns[b]);
                                            break;
                                        case('blank'):
                                            this.report.layout[this.layout][a].columns[b] = new Blank(this.report.layout[this.layout][a].columns[b]);
                                            break;
                                        case('value'):
                                            this.report.layout[this.layout][a].columns[b] = new Value(this.report.layout[this.layout][a].columns[b]);
                                            break;
                                        case('chart'):
                                            this.report.layout[this.layout][a].columns[b] = new Chart(this.report.layout[this.layout][a].columns[b]);
                                            break;
                                        case('gauge'):
                                            this.report.layout[this.layout][a].columns[b] = new Gauge(this.report.layout[this.layout][a].columns[b]);
                                            break;
                                        case('vector'):
                                            this.report.layout[this.layout][a].columns[b] = new Vector(this.report.layout[this.layout][a].columns[b]);
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
                if (this.report.layout[this.layout][a].rowId == this.rowId) {
                    for (let b = 0; b < this.report.layout[this.layout][a].columns.length; b++) {
                        if (this.report.layout[this.layout][a].columns[b].id == this.columnId) {
                            Object.keys(style).map(key => {
                                this.report.layout[this.layout][a].columns[b][key] = style[key];
                            });
                        };
                    };
                };
            };
        });

        this.subscriptions.changes = this.blox.changes.subscribe(rows => {
            rows.map(row => {
                for (let a = 0; a < this.report.layout[this.layout].length; a++) {
                    if (this.report.layout[this.layout][a].rowId == row.id) {
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
    };

    ngOnDestroy(): void {
        this.subscriptions.route.unsubscribe();
        this.subscriptions.setup.unsubscribe();
        this.subscriptions.style.unsubscribe();
        this.subscriptions.changes.unsubscribe();
    };

}