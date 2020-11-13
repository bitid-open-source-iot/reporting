import { Row } from 'src/app/interfaces/row';
import { Column } from 'src/app/interfaces/column';
import { Report } from 'src/app/interfaces/report';
import { ObjectId } from 'src/app/id';
import { MatSidenav } from '@angular/material/sidenav';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { ColumnSetupComponent } from './setup/setup.component';
import { ColumnStyleComponent } from './style/style.component';
import { ColumnConditionsComponent } from './conditions/conditions.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { OnInit, Component, OnDestroy, ViewChild } from '@angular/core';

@Component({
    selector: 'report-editor-page',
    styleUrls: ['./editor.page.scss'],
    templateUrl: './editor.page.html'
})

export class ReportEditorPage implements OnInit, OnDestroy {

    @ViewChild(MatSidenav, {'static': true}) public sidenav: MatSidenav;
    @ViewChild(ColumnSetupComponent, {'static': true}) private setup: ColumnSetupComponent;
    @ViewChild(ColumnStyleComponent, {'static': true}) private style: ColumnStyleComponent;
    @ViewChild(ColumnConditionsComponent, {'static': true}) private conditions: ColumnConditionsComponent;

    constructor(public devices: DevicesService) { };

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
            'desktop': [
                {
                    'rowId': ObjectId(),
                    'height': 100,
                    'position': 1,
                    'columns': [
                        {
                            'map': {},
                            'text': {
                                'value': 'hello world'
                            },
                            'fill': {
                                'color': '#FFFFFF',
                                'opacity': 50
                            },
                            'font': {
                                'size': 30,
                                'color': '#FFFFFF',
                                'family': 'Arial',
                                'opacity': 100,
                                'vertical': 'center',
                                'horizontal': 'center'
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
                                'color': '#000000'
                            },
                            'value': {
                                'color': '#000000',
                                'expression': null
                            },
                            'stroke': {
                                'color': '#000000',
                                'style': 'solid',
                                'width': 0,
                                'opacity': 100
                            },
                            'banner': {
                                'size': 14,
                                'color': '#FFFFFF',
                                'family': 'Arial',
                                'opacity': 100,
                                'vertical': 'top',
                                'horizontal': 'left'
                            },
                            'type': 'text',
                            'data': null,
                            'label': 'test',
                            'width': 100,
                            'columnId': ObjectId(),
                            'position': 1,
                            'conditions': []
                        }
                    ]
                }
            ]
        }
    };
    public layout: string = 'desktop';
    public loading: boolean;
    public editing: boolean = true;
    public reportId: string;
    public resizing: boolean = false;
    public columnId: string;
    private subscriptions: any = {};

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

    public async select(row: Row, column: Column) {
        this.rowId = row.rowId;
        this.columnId = column.columnId;

        this.setup.set(column);

        this.sidenav.open();
        // this.conditions.toggle();
        // this.conditions.set(column.conditions);
        this.style.set(column);
    };

    public async reorder(event: CdkDragDrop<string[]>) {
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
                        if (this.report.layout[this.layout][a].columns[b].columnId == this.columnId) {
                            Object.keys(setup).map(key => {
                                this.report.layout[this.layout][a].columns[b][key] = setup[key];
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
                        if (this.report.layout[this.layout][a].columns[b].columnId == this.columnId) {
                            Object.keys(style).map(key => {
                                this.report.layout[this.layout][a].columns[b][key] = style[key];
                            });
                        };
                    };
                };
            };
        });
        
        this.load();
    };

    ngOnDestroy(): void {
        this.subscriptions.setup.unsubscribe();
        this.subscriptions.style.unsubscribe();
    };

}