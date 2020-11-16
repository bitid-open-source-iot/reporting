import { Row } from 'src/app/interfaces/row';
import { Theme } from 'src/app/interfaces/theme';
import { Column } from 'src/app/interfaces/column';
import { Report } from 'src/app/interfaces/report';
import { ObjectId } from 'src/app/id';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { ThemeDialog } from './theme/theme.dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { AddRowDialog } from './add-row/add-row.dialog';
import { BloxComponent } from 'src/app/lib/blox/blox.component';
import { HistoryService } from 'src/app/services/history/history.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { ColumnSetupComponent } from './setup/setup.component';
import { ColumnStyleComponent } from './style/style.component';
import { ColumnConditionsComponent } from './conditions/conditions.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { OnInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { Map, Text, Chart, Value, Blank, Gauge, Vector } from 'src/app/lib/utilities/index';

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

    constructor(private dialog: MatDialog, public history: HistoryService, public devices: DevicesService) { };

    public rowId: string;
    public report: Report = {
        'theme': {
            'font': {
                'color': '#FFFFFF',
                'opacity': 100
            },
            'board': {
                'color': '#000000',
                'opacity': 100
            },
            'column': {
                'color': '#FFFFFF',
                'opacity': 25
            },
            'name': 'dark',
            'type': 'default'
        },
        'layout': {
            'mobile': [],
            'tablet': [],
            'desktop': []
        }
    };
    public layout: string = 'desktop';
    public loading: boolean;
    public editing: boolean = true;
    public reportId: string;
    public resizing: boolean = false;
    public columnId: string;
    private subscriptions: any = {};

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
                        'fill': {
                            'color': this.report.theme.column.color,
                            'opacity': this.report.theme.column.opacity
                        },
                        'width': 100 / count,
                        'position': i + 1
                    });
                    row.columns.push(item);
                };

                this.report.layout[this.layout].push(row);
                // this.save({
                //     'layout': this.report.layout
                // });
            };
        });
    };

    public async theme() {
        const dialog = await this.dialog.open(ThemeDialog, {
            'data': this.report.theme,
            'panelClass': 'fullscreen-dialog',
            'disableClose': true
        });

        await dialog.afterClosed().subscribe(async (result: Theme) => {
            if (result) {
                this.report.theme = result;
                // this.service.theme.next(result);
                this.report.layout.mobile.map(row => {
                    row.columns.map(column => {
                        if (typeof (column.display) == 'undefined' || column.display == null || column.display == '') {
                            column.fill.color = this.report.theme.column.color;
                            column.fill.opacity = this.report.theme.column.opacity;
                        };
                    });
                });
                this.report.layout.tablet.map(row => {
                    row.columns.map(column => {
                        if (typeof (column.display) == 'undefined' || column.display == null || column.display == '') {
                            column.fill.color = this.report.theme.column.color;
                            column.fill.opacity = this.report.theme.column.opacity;
                        };
                    });
                });
                this.report.layout.desktop.map(row => {
                    row.columns.map(column => {
                        if (typeof (column.display) == 'undefined' || column.display == null || column.display == '') {
                            column.fill.color = this.report.theme.column.color;
                            column.fill.opacity = this.report.theme.column.opacity;
                        };
                    });
                });
                // this.save({
                //     'theme': this.report.theme,
                //     'layout': this.report.layout
                // });
            };
        });
    };

    private async load() {
        this.loading = true;

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

        this.sidenav.open();
        // this.conditions.open();
        // this.conditions.set(column.conditions);
        this.style.set(column);
    };

    public unselect() {
        this.rowId = null;
        this.columnId = null;
        this.tabs.selectedIndex = 0;

        this.setup.reset();
        this.style.reset();
        // this.conditions.reset();

        this.sidenav.close();
        // this.conditions.close();
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
        // this.save({
        //     'layout': this.report.layout
        // });
    };

    public reorder(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.report.layout[this.layout], event.previousIndex, event.currentIndex);
        for (let a = 0; a < this.report.layout[this.layout].length; a++) {
            this.report.layout[this.layout][a].position = a + 1;
            for (let b = 0; b < this.report.layout[this.layout][a].columns.length; b++) {
                this.report.layout[this.layout][a].columns[b].position = b + 1;
            };
        };
        // this.save({
        //     'layout': this.report.layout
        // });
    };

    ngOnInit(): void {
        this.subscriptions.setup = this.setup.change.subscribe(setup => {
            for (let a = 0; a < this.report.layout[this.layout].length; a++) {
                if (this.report.layout[this.layout][a].rowId == this.rowId) {
                    for (let b = 0; b < this.report.layout[this.layout][a].columns.length; b++) {
                        if (this.report.layout[this.layout][a].columns[b].id == this.columnId) {
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
                                if (this.report.layout[this.layout][a].columns[b].columnId == column.id) {
                                    this.report.layout[this.layout][a].columns[b].width = column.width;
                                };
                            };
                        });
                    };
                };
            });
            // this.save({
            //     'layout': this.report.layout
            // });
        });
        
        this.load();
    };

    ngOnDestroy(): void {
        this.subscriptions.setup.unsubscribe();
        this.subscriptions.style.unsubscribe();
    };

}