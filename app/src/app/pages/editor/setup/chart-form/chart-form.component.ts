import { SERIES } from 'src/app/lib/utilities/index';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Input, OnInit, Component, OnDestroy, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'chart-form',
    styleUrls: ['./chart-form.component.scss'],
    templateUrl: './chart-form.component.html',
    encapsulation: ViewEncapsulation.None
})

export class ChartForm implements OnInit, OnDestroy {

    @Input('type') public type: string;

    constructor(public devices: DevicesService, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'src': new FormControl(null, [Validators.required])
    });
    public errors: any = {
        'src': ''
    };
    public series: MatTableDataSource<SERIES> = new MatTableDataSource<SERIES>();
    public change: EventEmitter<any> = new EventEmitter<any>();
    public columns: string[] = [];
    public setting: boolean;
    public loading: boolean;
    private subscriptions: any = {};

    public async set(data) {
        this.setting = true;
        
        Object.keys(this.form.controls).map(key => this.form.controls[key].setValue(data[key]));
        
        this.setting = false;
    };

    ngOnInit(): void {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
            if (!this.setting) {
                this.change.next(data);
            };
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
    };

}