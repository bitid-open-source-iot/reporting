import { Theme } from 'src/app/interfaces/theme';
import { ObjectId } from 'src/app/id';
import { MatDialog } from '@angular/material/dialog';
import { ThemeDialog } from './theme/theme.dialog';
import { WidgetDialog } from './widget/widget.dialog';
import { AddRowDialog } from './add-row/add-row.dialog';
import { ToastService } from 'src/app/services/toast/toast.service';
import { BloxComponent } from 'src/app/lib/blox/blox.component';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from 'src/app/services/history/history.service';
import { Report, Widget } from 'src/app/interfaces/report';
import { LinkWidgetDialog } from './link/link.dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';

@Component({
    selector: 'app-report-editor-page',
    styleUrls: ['./editor.page.scss'],
    templateUrl: './editor.page.html'
})

export class ReportEditorPage implements OnInit, OnDestroy {

    @ViewChild(BloxComponent, {'static': true}) private blox: BloxComponent;

    constructor(private route: ActivatedRoute, private dialog: MatDialog, private toast: ToastService, public history: HistoryService, private service: ReportsService, private formerror: FormErrorService) { };

    public row: any;
    public form: FormGroup = new FormGroup({
        'url': new FormControl(''),
        'description': new FormControl('')
    });
    public rows: any[] = [];
    public mode: string;
    public axis: string;
    public start: any = {
        'x': 0,
        'y': 0
    };
    public errors: any = {
        'url': '',
        'description': ''
    };
    public layout: string = 'desktop';
    public report: Report = {
        'theme': {
            'name': 'dark',
            'color': 'rgba(255, 255, 255, 1)',
            'board': 'rgba(0, 0, 0, 1)',
            'column': 'rgba(255, 255, 255, 0.25)'
        },
        'layout': {
            'mobile': {
                'rows': []
            },
            'tablet': {
                'rows': []
            },
            'desktop': {
                'rows': []
            }
        },
        'widgets': []
    };
    public column: any;
    public loading: boolean;
    public reportId: string;
    public resizing: boolean;
    private subscriptions: any = {};

    public async add() {
        const dialog = await this.dialog.open(AddRowDialog, {
            'panelClass': 'share-dialog',
            'disableClose': true
        });

        await dialog.afterClosed().subscribe(async count => {
            if (count) {
                let row = {
                    'style': {
                        'height': 100
                    },
                    'columns': [],
                    'rowId': ObjectId(),
                    'position': this.report.layout[this.layout].rows.length
                };

                for (let i = 0; i < count; i++) {
                    row.columns.push({
                        'style': {
                            'width': parseFloat((100 / count).toFixed(2)),
                            'color': this.report.theme.color,
                            'background': this.report.theme.column
                        },
                        'columnId': ObjectId(),
                        'position': i + 1
                    })
                };

                this.report.layout[this.layout].rows.push(row);
                this.save('layout', this.report.layout);
            };
        });
    };

    private async get() {
        this.loading = true;

        const response = await this.service.get({
            'filter': [
                'url',
                'type',
                'role',
                'theme',
                'layout',
                'widgets',
                'reporId',
                'description'
            ],
            'reportId': this.reportId
        });

        if (response.ok) {
            if (response.result.type == 'ds') {
                this.form.controls['url'].setValue(response.result.url);
                this.form.controls['url'].setValidators([Validators.required]);
                this.form.controls['url'].updateValueAndValidity();
                this.form.controls['description'].setValue(response.result.description);
                this.form.controls['description'].setValidators([Validators.required]);
                this.form.controls['description'].updateValueAndValidity();
            };
            this.report.role = response.result.role;
            this.report.type = response.result.type;
            this.report.theme = response.result.theme;
            this.report.reportId = response.result.reportId;
            this.report.description = response.result.description;
            if (Array.isArray(response.result.widgets)) {
                this.report.widgets = response.result.widgets;
            };
            if (typeof(response.result.layout) != 'undefined' && response.result.layout != null && response.result.layout != '') {
                this.report.layout = response.result.layout;
            };
        } else {
            this.toast.error(response.error.message);
            this.history.back();
        };

        this.loading = false;
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

    public async EditTheme() {
        const dialog = await this.dialog.open(ThemeDialog, {
            'data': this.report.theme,
            'panelClass': 'fullscreen-dialog',
            'disableClose': true
        });

        await dialog.afterClosed().subscribe(async (result: Theme) => {
            if (result) {
                this.report.theme = result;
                this.report.layout.mobile.rows.map(row => {
                    row.columns.map(column => {
                        column.style.background = this.report.theme.column;
                    });
                });
                this.report.layout.tablet.rows.map(row => {
                    row.columns.map(column => {
                        column.style.background = this.report.theme.column;
                    });
                });
                this.report.layout.desktop.rows.map(row => {
                    row.columns.map(column => {
                        column.style.background = this.report.theme.column;
                    });
                });
                this.save('theme', this.report.theme);
                this.save('layout', this.report.layout);
            };
        });
    };

    public async save(key, value) {
        let params: any = {
            'reportId': this.reportId
        };
        params[key] = value;

        const response = await this.service.update(params);

        if (!response.ok) {
            this.toast.error(response.error.message);
        };
    };

    public async link(row, column) {
        const dialog = await this.dialog.open(LinkWidgetDialog, {
            'data': {
                'widgets': this.report.widgets,
                'widgetId': column.widgetId
            },
            'panelClass': 'share-dialog',
            'disableClose': true
        });

        await dialog.afterClosed().subscribe(async widgetId => {
            if (widgetId) {
                for (let i = 0; i < row.columns.length; i++) {
                    if (row.columns[i].columnId == column.columnId) {
                        row.columns[i].widgetId = widgetId;
                        this.save('layout', this.report.layout);
                        break;
                    };
                };
            };
        });
    };

    public async DoResizing(event) {
        if (this.resizing) {
            if (this.axis == 'x') {
                const diff = parseFloat((((event.pageX - this.start.x) / this.blox.element.clientWidth) * 100).toFixed(2));
                this.column.style.width += diff;
                this.start.x = event.pageX;
                this.row.columns = this.row.columns.sort((a, b) => {
                    if (a.position < b.position) {
                        return -1;
                    } else if (a.position > b.position) {
                        return 1;
                    } else {
                        return 0;
                    };
                });
                this.row.columns.map(col => {
                    if (col.position - 1 == this.column.position) {
                        col.style.width -= diff;
                    };
                });
            } else if (this.axis == 'y') {
                this.row.style.height = this.row.style.height + (event.pageY - this.start.y);
                this.start.y = event.pageY;
            };
        };
    };

    public async remove(row, columnId) {
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
                    width = row.columns[i].style.width;
                    row.columns.splice(i, 1);
                    break;
                };
            };
            
            row.columns.map(column => {
                column.style.width += parseFloat((width / row.columns.length).toFixed(2));
            });
            for (let i = 0; i < row.columns.length; i++) {
                row.columns[i].position = i + 1;
            }
        } else {
            for (let i = 0; i < this.report.layout[this.layout].rows.length; i++) {
                if (this.report.layout[this.layout].rows[i].rowId == row.rowId) {
                    this.report.layout[this.layout].rows.splice(i, 1);
                    break;
                };
            };
        };
        this.save('layout', this.report.layout);
    };

    public GetWidgetLabel(widgetId: string) {
        for (let i = 0; i < this.report.widgets.length; i++) {
            if (this.report.widgets[i].widgetId == widgetId) {
                return this.report.widgets[i].label.value;
            };
        };
    };

    public async RemoveWidget(widgetId: string) {
        for (let i = 0; i < this.report.widgets.length; i++) {
            if (this.report.widgets[i].widgetId == widgetId) {
                this.report.widgets.splice(i, 1);
                this.save('widgets', this.report.widgets);
                break;
            };
        };
        for (let a = 0; a < this.report.layout.mobile.rows.length; a++) {
            for (let b = 0; b < this.report.layout.mobile.rows[a].columns.length; b++) {
                if (this.report.layout.mobile.rows[a].columns[b].widgetId == widgetId) {
                    this.report.layout.mobile.rows[a].columns[b].widgetId = null;
                };
            };
        };
        for (let a = 0; a < this.report.layout.tablet.rows.length; a++) {
            for (let b = 0; b < this.report.layout.tablet.rows[a].columns.length; b++) {
                if (this.report.layout.tablet.rows[a].columns[b].widgetId == widgetId) {
                    this.report.layout.tablet.rows[a].columns[b].widgetId = null;
                };
            };
        };
        for (let a = 0; a < this.report.layout.desktop.rows.length; a++) {
            for (let b = 0; b < this.report.layout.desktop.rows[a].columns.length; b++) {
                if (this.report.layout.desktop.rows[a].columns[b].widgetId == widgetId) {
                    this.report.layout.desktop.rows[a].columns[b].widgetId = null;
                };
            };
        };
        this.save('layout', this.report.layout);
    };

    public async FinishResizing(event: MouseEvent) {
        if (typeof(this.row) != 'undefined' && this.row != null || typeof(this.column) != 'undefined' && this.column != null) {
            this.save('layout', this.report.layout);
        };
        this.row = null;
        this.axis = null;
        this.column = null;
        this.start.x = 0;
        this.start.y = 0;
        this.resizing = false;
    };

    public async DropRow(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.report.layout[this.layout].rows, event.previousIndex, event.currentIndex);
        for (let a = 0; a < this.report.layout[this.layout].rows.length; a++) {
            this.report.layout[this.layout].rows[a].position = a + 1;
            for (let b = 0; b < this.report.layout[this.layout].rows.length; b++) {
                this.report.layout[this.layout].rows[a].columns[b].position = b + 1;
            };
        };
        this.save('layout', this.report.layout);
    };

    public async EditWidget(mode: string, widget?: Widget) {
        if (mode == 'add') {
            widget = {
                'label': {
                    'value': '',
                    'visable': true
                },
                'chart': {},
                'value': {},
                'query': {},
                'widgetId': ObjectId()
            };
        };
        const dialog = await this.dialog.open(WidgetDialog, {
            'data': widget,
            'panelClass': 'fullscreen-dialog',
            'disableClose': true
        });

        await dialog.afterClosed().subscribe(async result => {
            if (result) {
                if (mode == 'add') {
                    this.report.widgets.push(result);
                } else if (mode == 'edit') {
                    this.report.widgets.map(widget => {
                        if (widget.widgetId == result.widgetId) {
                            Object.keys(result).map(key => {
                                widget[key] = result[key];
                            });
                        };
                    });
                };
                this.save('widgets', this.report.widgets);
            };
        });
    };

    public async StartResizing(axis, event: MouseEvent, row, column) {
        this.row = row;
        this.axis = axis;
        this.column = column;
        this.start.x = event.pageX;
        this.start.y = event.pageY;
        this.resizing = true;
    };

    ngOnInit(): void {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });

        this.subscriptions.route = this.route.queryParams.subscribe(params => {
            this.mode = params.mode;
            this.reportId = params.reportId;
            if (this.mode != 'add') {
                this.get();
            };
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
        this.subscriptions.route.unsubscribe();
    };

}