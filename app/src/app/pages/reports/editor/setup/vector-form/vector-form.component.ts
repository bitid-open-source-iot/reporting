import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/services/toast/toast.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Input, OnInit, Component, OnDestroy, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'vector-form',
    styleUrls: ['./vector-form.component.scss'],
    templateUrl: './vector-form.component.html',
    encapsulation: ViewEncapsulation.None
})

export class VectorForm implements OnInit, OnDestroy {

    @Input('type') public type: string;

    constructor(private toast: ToastService, private formerror: FormErrorService, private localstorage: LocalstorageService) { };

    public form: FormGroup = new FormGroup({
        'src': new FormControl(null, [Validators.required])
    });
    public errors: any = {
        'src': ''
    };
    public change: EventEmitter<any> = new EventEmitter<any>();
    public setting: boolean;
    public loading: boolean;
    private subscriptions: any = {};

    public async upload() {
        const input = document.createElement('input');
        input.min = '1';
        input.max = '1';
        input.type = 'file';
        input.accept = 'image/*';
        input.click();
        input.onchange = async (event: any) => {
            this.loading = true;
            const url = [environment.drive, '/drive/files/upload?email=', this.localstorage.get('email'), '&appId=', environment.appId].join('');
            const form = new FormData();
            const request = new XMLHttpRequest();

            for (var i = 0; i < event.target.files.length; i++) {
                form.append('uploads[]', event.target.files[i], event.target.files[i].name);
            };

            request.onreadystatechange = (event) => {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        const response = JSON.parse(request.response);
                        this.form.controls['src'].setValue([environment.drive, '/drive/files/get?fileId=', response.fileId, '&token=', response.token].join(''));
                        this.loading = false;
                    } else {
                        this.toast.error('issue uploading image!');
                        this.loading = false;
                    };
                };
            };

            request.open('POST', url, true);
            request.setRequestHeader('Authorization', this.localstorage.get('token'));
            request.send(form);
        };
    };

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