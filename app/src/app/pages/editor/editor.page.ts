import { Row } from 'src/app/interfaces/row';
import { Column } from 'src/app/interfaces/column';
import { Report } from 'src/app/interfaces/report';
import { ObjectId } from 'src/app/id';
import { MatSidenav } from '@angular/material/sidenav';
import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/services/toast/toast.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { ConditionsComponent } from './conditions/conditions.component';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';
import { ConfigorationComponent } from './configoration/configoration.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit, Component, OnDestroy, ViewChild } from '@angular/core';

@Component({
    selector: 'report-editor-page',
    styleUrls: ['./editor.page.scss'],
    templateUrl: './editor.page.html'
})

export class ReportEditorPage implements OnInit, OnDestroy {

    @ViewChild(MatSidenav, {'static': true}) public sidenav: MatSidenav;
    @ViewChild(ConditionsComponent, {'static': true}) private conditions: ConditionsComponent;
    @ViewChild(ConfigorationComponent, {'static': true}) private configoration: ConfigorationComponent;

    constructor(private toast: ToastService, public devices: DevicesService, private localstorage: LocalstorageService) { };

    public form: FormGroup = new FormGroup({
        'map': new FormGroup({}),
        'text': new FormGroup({
            'value': new FormControl(null)
        }),
        'table': new FormGroup({}),
        'gauge': new FormGroup({}),
        'image': new FormGroup({
            'src': new FormControl(null)
        }),
        'query': new FormGroup({
            'inputId': new FormControl(null),
            'deviceId': new FormControl(null)
        }),
        'chart': new FormGroup({
            'type': new FormControl(null)
        }),
        'value': new FormGroup({
            'expression': new FormControl(null)
        }),
        'label': new FormControl(null, [Validators.required]),
        'display': new FormControl(null, [Validators.required]),
        'columnId': new FormControl(null, [Validators.required]),
        'conditions': new FormControl(null, [Validators.required])
    });
    public rowId: string;
    public filter: FormGroup = new FormGroup({
        'input': new FormControl(null),
        'device': new FormControl(null)
    });
    public errors: any = {
        'map': {},
        'text': {
            'value': ''
        },
        'image': {
            'src': ''
        },
        'table': {},
        'gauge': {},
        'query': {
            'inputId': '',
            'deviceId': ''
        },
        'chart': {
            'type': ''
        },
        'value': {
            'expression': ''
        },
        'label': '',
        'display': '',
        'columnId': ''
    };
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
                                'opacity': 100
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
    public inputs: any[] = [];
    public layout: string = 'desktop';
    public loading: boolean;
    public editing: boolean = true;
    public displays: any[] = [
        {
            'value': 'chart',
            'description': 'Chart'
        },
        // {
        //     'value': 'gauge',
        //     'description': 'Gauge'
        // },
        {
            'value': 'image',
            'description': 'Image'
        },
        // {
        //     'value': 'map',
        //     'description': 'Map'
        // },
        // {
        //     'value': 'table',
        //     'description': 'Table'
        // },
        {
            'value': 'text',
            'description': 'Text'
        },
        {
            'value': 'value',
            'description': 'Value'
        },
        {
            'value': 'spacer',
            'description': 'Spacer'
        }
    ];
    public reportId: string;
    public resizing: boolean = false;
    public columnId: string;
    public uploading: boolean;
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

    public async upload() {
        const input = document.createElement('input');
        input.min = '1';
        input.max = '1';
        input.type = 'file';
        input.accept = 'image/*';
        input.click();
        input.onchange = async (event: any) => {
            this.uploading = true;
            const url = [environment.drive, '/drive/files/upload?email=', this.localstorage.get('email'), '&appId=', environment.appId].join('');
            const form = new FormData();
            const request = new XMLHttpRequest();

            for (var i = 0; i < event.target.files.length; i++) {
                form.append("uploads[]", event.target.files[i], event.target.files[i].name);
            };

            request.onreadystatechange = (event) => {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        const response = JSON.parse(request.response);
                        const image: FormGroup = <any>this.form.controls['image'];
                        image.controls['src'].setValue([environment.drive, '/drive/files/get?fileId=', response.fileId, "&token=", response.token].join(''));
                        this.uploading = false;
                    } else {
                        this.toast.error('issue uploading image!');
                        this.uploading = false;
                    };
                };
            };

            request.open("POST", url, true);
            request.setRequestHeader('Authorization', this.localstorage.get('token'));
            request.send(form);
        };
    };

    public async select(row: Row, column: Column) {
        this.rowId = row.rowId;
        this.columnId = column.columnId;
        this.sidenav.open();
        this.conditions.toggle();
        this.conditions.set(column.conditions);
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
        this.subscriptions.deviceId = (<FormGroup>this.form.controls['query']).controls['deviceId'].valueChanges.subscribe(deviceId => {
            for (let i = 0; i < this.devices.data.length; i++) {
                if (this.devices.data[i].deviceId == deviceId) {
                    this.inputs = this.devices.data[i].inputs;
                    break;
                };
            };
        });

        this.subscriptions.configoration = this.configoration.change.subscribe(configoration => {
            for (let a = 0; a < this.report.layout[this.layout].length; a++) {
                if (this.report.layout[this.layout][a].rowId == this.rowId) {
                    for (let b = 0; b < this.report.layout[this.layout][a].columns.length; b++) {
                        if (this.report.layout[this.layout][a].columns[b].columnId == this.columnId) {
                            Object.keys(configoration).map(key => {
                                this.report.layout[this.layout][a].columns[b][key] = configoration[key];
                            });
                        };
                    };
                };
            };
        });
        
        this.load();

        this.sidenav.open();
    };

    ngOnDestroy(): void {
        this.subscriptions.deviceId.unsubscribe();
        this.subscriptions.configoration.unsubscribe();
    };

}