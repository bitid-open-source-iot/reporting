import { Report } from 'src/app/interfaces/report';
import { ObjectId } from 'src/app/id';
import { MatDialog } from '@angular/material/dialog';
import { AddRowDialog } from './add-row/add-row.dialog';
import { ToastService } from 'src/app/services/toast/toast.service';
import { BloxComponent } from 'src/app/lib/blox/blox.component';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from 'src/app/services/history/history.service';
import { OnInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-report-editor-page',
    styleUrls: ['./editor.page.scss'],
    templateUrl: './editor.page.html'
})

export class ReportEditorPage implements OnInit, OnDestroy {

    @ViewChild(BloxComponent, {'static': true}) private blox: BloxComponent;

    constructor(private route: ActivatedRoute, private dialog: MatDialog, private toast: ToastService, public history: HistoryService, private service: ReportsService) { };

    public row: any;
    public rows: any[] = [];
    public axis: string;
    public start: any = {
        'x': 0,
        'y': 0
    };
    public layout: string = 'desktop';
    public report: Report = {
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
        }
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
                            'background': '#FFF'
                        },
                        'columnId': ObjectId(),
                        'position': i + 1
                    })
                };

                this.report.layout[this.layout].rows.push(row);
            };
        });
    };

    private async get() {
        this.loading = true;

        const response = await this.service.get({
            'filter': [
                'role',
                'reporId',
                'description'
            ],
            'reportId': this.reportId
        });

        if (response.ok) {
            this.report.role = response.result.role;
            this.report.reportId = response.result.reportId;
            this.report.description = response.result.description;
        } else {
            this.toast.error(response.error.message);
            this.history.back();
        };

        this.loading = false;
    };

    public async remove(row, columnId) {
        if (row.columns.length > 1) {
            for (let i = 0; i < row.columns.length; i++) {
                if (row.columns[i].columnId == columnId) {
                    row.columns.splice(i, 1);
                    break;
                };
            };
            let max: number = 0;
            row.columns.map(o => (max += o.style.width));
            row.columns.map(column => {
                column.style.width = parseFloat((column.style.width / max).toFixed(2)) * 100;
            });
        } else {
            for (let i = 0; i < this.report.layout[this.layout].rows.length; i++) {
                if (this.report.layout[this.layout].rows[i].rowId == row.rowId) {
                    this.report.layout[this.layout].rows.splice(i, 1);
                    break;
                };
            };
        };
    };

    public async DoResizing(event) {
        if (this.resizing) {
            if (this.axis == 'x') {
                const diff = parseFloat((((event.pageX - this.start.x) / this.blox.element.clientWidth) * 100).toFixed(2));
                this.column.style.width += diff;
                this.start.x = event.pageX;
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

    public async FinishResizing(event: MouseEvent) {
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
    };

    public async DropColumn(row, event: CdkDragDrop<string[]>) {
        moveItemInArray(row, event.previousIndex, event.currentIndex);
        for (let a = 0; a < this.report.layout[this.layout].rows.length; a++) {
            this.report.layout[this.layout].rows[a].position = a + 1;
            for (let b = 0; b < this.report.layout[this.layout].rows.length; b++) {
                this.report.layout[this.layout].rows[a].columns[b].position = b + 1;
            };
        };
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
        this.subscriptions.route = this.route.queryParams.subscribe(params => {
            this.reportId = params.reportId;
            this.get();
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.route.unsubscribe();
    };

}