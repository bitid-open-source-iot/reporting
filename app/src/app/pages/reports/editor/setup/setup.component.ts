import { TextForm } from './text-form/text-form.component';
import { ValueForm } from './value-form/value-form.component';
import { ChartForm } from './chart-form/chart-form.component';
import { VectorForm } from './vector-form/vector-form.component';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit, Component, OnDestroy, ViewChild, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'column-setup',
    styleUrls: ['./setup.component.scss'],
    templateUrl: './setup.component.html',
    encapsulation: ViewEncapsulation.None
})

export class ColumnSetupComponent implements OnInit, OnDestroy {

    @ViewChild(TextForm, {'static': true}) private text: TextForm;
    @ViewChild(ValueForm, {'static': true}) private value: ValueForm;
    @ViewChild(ChartForm, {'static': true}) private chart: ChartForm;
    @ViewChild(VectorForm, {'static': true}) private vector: VectorForm;

    constructor(private el: ElementRef, public devices: DevicesService, private formerror: FormErrorService) {
        this.element = this.el.nativeElement;
    };

    public form: FormGroup = new FormGroup({
        'type': new FormControl(null, [Validators.required]),
        'label': new FormControl(null, [Validators.required])
    });
    public types: any[] = [
        {
            'value': 'chart',
            'disabled': false,
            'description': 'Chart'
        },
        {
            'value': 'blank',
            'disabled': false,
            'description': 'Blank'
        },
        {
            'value': 'gauge',
            'disabled': true,
            'description': 'Gauge'
        },
        {
            'value': 'vector',
            'disabled': false,
            'description': 'Vector'
        },
        {
            'value': 'map',
            'disabled': true,
            'description': 'Map'
        },
        {
            'value': 'table',
            'disabled': true,
            'description': 'Table'
        },
        {
            'value': 'text',
            'disabled': false,
            'description': 'Text'
        },
        {
            'value': 'value',
            'disabled': false,
            'description': 'Value'
        }
    ];
    public filter: FormGroup = new FormGroup({
        'input': new FormControl(null),
        'device': new FormControl(null)
    });
    public errors: any = {
        'type': '',
        'label': ''
    };
    public inputs: any[] = [];
    public change: EventEmitter<any> = new EventEmitter<any>();
    public element: HTMLElement;
    public setting: boolean;
    public loading: boolean;
    public uploading: boolean;
    private subscriptions: any = {};

    public async reset() {
        this.form.setValue({
            'type': null,
            'label': null
        });
        this.form.markAsUntouched();
    };

    public async set(data) {
        this.setting = true;
        Object.keys(this.form.controls).map(key => {
            if (this.form.controls[key] instanceof FormGroup) {
                Object.keys((<FormGroup>this.form.controls[key]).controls).map(sub => {
                    (<FormGroup>this.form.controls[key]).controls[sub].setValue(data[key][sub]);
                });
            } else if (this.form.controls[key] instanceof FormControl) {
                this.form.controls[key].setValue(data[key]);
            };
        });
        this.text.set(data);
        this.chart.set(data);
        this.value.set(data);
        this.vector.set(data);
        this.setting = false;
    };

    ngOnInit(): void {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
            if (!this.setting) {
                this.change.next(data);
            };
        });
                
        this.subscriptions.text = this.text.change.subscribe(text => {
            if (!this.setting) {
                let data = this.form.value;
                Object.keys(text).map(key => {
                    data[key] = text[key];
                });
                this.change.next(data);
            };
        });

        this.subscriptions.chart = this.chart.change.subscribe(chart => {
            if (!this.setting) {
                let data = this.form.value;
                Object.keys(chart).map(key => {
                    data[key] = chart[key];
                });
                this.change.next(data);
            };
        });

        this.subscriptions.value = this.value.change.subscribe(value => {
            if (!this.setting) {
                let data = this.form.value;
                Object.keys(value).map(key => {
                    data[key] = value[key];
                });
                this.change.next(data);
            };
        });

        this.subscriptions.vector = this.vector.change.subscribe(vector => {
            if (!this.setting) {
                let data = this.form.value;
                Object.keys(vector).map(key => {
                    data[key] = vector[key];
                });
                this.change.next(data);
            };
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
        this.subscriptions.text.unsubscribe();
        this.subscriptions.chart.unsubscribe();
        this.subscriptions.value.unsubscribe();
        this.subscriptions.vector.unsubscribe();
    };

}