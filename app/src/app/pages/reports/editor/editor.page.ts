import { Row } from 'src/app/interfaces/row';
import { Theme } from 'src/app/interfaces/theme';
import { Column } from 'src/app/interfaces/column';
import { Report } from 'src/app/interfaces/report';
import { ObjectId } from 'src/app/id';
import { MatDialog } from '@angular/material/dialog';
import { ThemeDialog } from './theme/theme.dialog';
import { AddRowDialog } from './add-row/add-row.dialog';
import { ToastService } from 'src/app/services/toast/toast.service';
import { BloxComponent } from 'src/app/lib/blox/blox.component';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from 'src/app/services/history/history.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { ColumnEditorDialog } from './column/column.dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnInit, Component, OnDestroy, ViewChild } from '@angular/core';

@Component({
    selector: 'app-report-editor-page',
    styleUrls: ['./editor.page.scss'],
    templateUrl: './editor.page.html'
})

export class ReportEditorPage implements OnInit, OnDestroy {

    @ViewChild(BloxComponent, {'static': true}) private blox: BloxComponent;

    constructor(private route: ActivatedRoute, private dialog: MatDialog, private toast: ToastService, private devices: DevicesService, public history: HistoryService, private service: ReportsService, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'url': new FormControl(''),
        'description': new FormControl('')
    });
    public errors: any = {
        'url': '',
        'description': ''
    };
    public layout: string = 'desktop';
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
    public loading: boolean;
    public editing: boolean = true;
    public reportId: string;
    public resizing: boolean = false;
    private subscriptions: any = {};

    public async add() {
        const dialog = await this.dialog.open(AddRowDialog, {
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
                    row.columns.push({
                        'map': {},
                        'text': {
                            'value': null
                        },
                        'fill': {
                            'color': this.report.theme.column.color,
                            'opacity': this.report.theme.column.opacity
                        },
                        'font': {
                            'size': 30,
                            'color': this.report.theme.font.color,
                            'family': 'Arial',
                            'opacity': this.report.theme.font.opacity
                        },
                        'image': {
                            'src': null
                        },
                        'gauge': {},
                        'table': {},
                        'query': {
                            'inputId': null,
                            'deviceId': null
                        },
                        'chart': {
                            'type': null,
                            'color': null
                        },
                        'value': {
                            'color': null,
                            'expression': null
                        },
                        'stroke': {
                            'color': this.report.theme.column.color,
                            'style': 'solid',
                            'width': 0,
                            'opacity': this.report.theme.column.opacity
                        },
                        'banner': {
                            'size': 14,
                            'color': this.report.theme.font.color,
                            'family': 'Arial',
                            'opacity': this.report.theme.font.opacity,
                            'vertical': 'top',
                            'horizontal': 'left'
                        },
                        'type': null,
                        'data': null,
                        'label': null,
                        'width': parseFloat((100 / count).toFixed(2)),
                        'columnId': ObjectId(),
                        'position': i + 1,
                        'conditions': []
                    });
                };

                this.report.layout[this.layout].push(row);
                this.save({
                    'layout': this.report.layout
                });
            };
        });
    };

    private async get() {
        this.loading = true;

        const report = await this.service.get({
            'filter': [
                'url',
                'type',
                'role',
                'theme',
                'layout',
                'reporId',
                'description'
            ],
            'reportId': this.reportId
        });

        if (report.ok) {
            if (report.result.type == 'ds') {
                this.form.controls['url'].setValue(report.result.url);
                this.form.controls['url'].setValidators([Validators.required]);
                this.form.controls['url'].updateValueAndValidity();
                this.form.controls['description'].setValue(report.result.description);
                this.form.controls['description'].setValidators([Validators.required]);
                this.form.controls['description'].updateValueAndValidity();
            };
            if (typeof(report.result.role) != 'undefined' && report.result.role !== null && report.result.role !== '') {
                this.report.role = report.result.role;
            };
            if (typeof(report.result.type) != 'undefined' && report.result.type !== null && report.result.type !== '') {
                this.report.type = report.result.type;
            };
            if (typeof(report.result.theme) != 'undefined' && report.result.theme !== null && report.result.theme !== '') {
                this.report.theme = report.result.theme;
            };
            if (typeof(report.result.reportId) != 'undefined' && report.result.reportId !== null && report.result.reportId !== '') {
                this.report.reportId = report.result.reportId;
            };
            if (typeof(report.result.description) != 'undefined' && report.result.description !== null && report.result.description !== '') {
                this.report.description = report.result.description;
            };
            this.service.theme.next(this.report.theme);
            if (typeof(report.result.layout) != 'undefined' && report.result.layout != null && report.result.layout != '') {
                this.report.layout = report.result.layout;
            };
            const devices = await this.devices.list({
                'filter': [
                    'inputs',
                    'deviceId',
                    'description'
                ]
            });
            if (devices.ok) {
                this.devices.data = devices.result;
            };
        } else {
            this.toast.error(report.error.message);
            this.history.back();
        };

        this.loading = false;
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
                this.service.theme.next(result);
                this.report.layout.mobile.map(row => {
                    row.columns.map(column => {
                        if (typeof(column.display) == 'undefined' || column.display == null || column.display == '') {
                            column.fill.color = this.report.theme.column.color;
                            column.fill.opacity = this.report.theme.column.opacity;
                        };
                    });
                });
                this.report.layout.tablet.map(row => {
                    row.columns.map(column => {
                        if (typeof(column.display) == 'undefined' || column.display == null || column.display == '') {
                            column.fill.color = this.report.theme.column.color;
                            column.fill.opacity = this.report.theme.column.opacity;
                        };
                    });
                });
                this.report.layout.desktop.map(row => {
                    row.columns.map(column => {
                        if (typeof(column.display) == 'undefined' || column.display == null || column.display == '') {
                            column.fill.color = this.report.theme.column.color;
                            column.fill.opacity = this.report.theme.column.opacity;
                        };
                    });
                });
                this.save({
                    'theme': this.report.theme,
                    'layout': this.report.layout
                });
            };
        });
    };

    public async update() {
        this.loading = true;

        const response = await this.service.update({
            'url': this.form.value.url,
            'reportId': this.reportId,
            'description': this.form.value.description
        });

        if (response.ok) {
            this.history.back();
            this.toast.success('report updated!');
        } else {
            this.toast.error(response.error.message);
        };

        this.loading = false;
    };

    public async save(params) {
        params.reportId = this.reportId;
        const response = await this.service.update(params);

        if (!response.ok) {
            this.toast.error(response.error.message);
        };
    };

    public async remove(event, row, columnId) {
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
                if (row.columns[i].columnId == columnId) {
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
        this.save({
            'layout': this.report.layout
        });
    };
    
    public async edit(row: Row, column: Column) {
        const dialog = await this.dialog.open(ColumnEditorDialog, {
            'data': column,
            'panelClass': 'fullscreen-dialog',
            'disableClose': true
        });

        await dialog.afterClosed().subscribe(async result => {
            if (result) {
                for (let a = 0; a < this.report.layout[this.layout].length; a++) {
                    if (this.report.layout[this.layout][a].rowId == row.rowId) {
                        for (let b = 0; b < this.report.layout[this.layout][a].columns.length; b++) {
                            if (this.report.layout[this.layout][a].columns[b].columnId == column.columnId) {
                                Object.keys(result).map(key => {
                                    this.report.layout[this.layout][a].columns[b][key] = result[key];
                                });
                                this.report.layout[this.layout][a].columns[b].conditions.map(condition => {
                                    if (condition.type == 'default') {
                                        this.report.layout[this.layout][a].columns[b].fill = condition.fill;
                                        this.report.layout[this.layout][a].columns[b].font = condition.font;
                                        this.report.layout[this.layout][a].columns[b].stroke = condition.stroke;
                                        this.report.layout[this.layout][a].columns[b].banner = condition.banner;
                                        this.report.layout[this.layout][a].columns[b].gridlines = condition.gridlines;
                                        this.report.layout[this.layout][a].columns[b].chartfill = condition.chartfill;
                                    };
                                });
                                this.save({
                                    'layout': this.report.layout
                                });
                                break;
                            };
                        };
                        break;
                    };
                };
            };
        });
    };

    public async reorder(event: CdkDragDrop<string[]>) {
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
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });

        this.subscriptions.route = this.route.queryParams.subscribe(params => {
            this.reportId = params.reportId;
            this.get();
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
            this.save({
                'layout': this.report.layout
            });
        });

        this.subscriptions.resizing = this.blox.resizing.subscribe(resizing => {
            this.resizing = resizing;
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
        this.subscriptions.route.unsubscribe();
        this.subscriptions.resizing.unsubscribe();
    };

}