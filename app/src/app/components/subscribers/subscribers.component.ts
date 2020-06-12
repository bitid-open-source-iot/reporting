import { environment } from 'src/environments/environment';
import { TranslateService } from '@bitid/translate';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { Inject, OnInit, Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector:       'subscribers',
    styleUrls:      ['./subscribers.component.scss'],
    templateUrl:    './subscribers.component.html'
})

export class SubscribersComponent implements OnInit, OnDestroy {
    
    @ViewChild('searchbox', {'static': true}) private searchbox: ElementRef;
    
    constructor(private dialog: MatDialogRef<SubscribersComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private translate: TranslateService, private localstorage: LocalstorageService) {}
    
    public type:            any     = this.data.type;
    public role:            number  = 0;
    public roles:           any[]   = environment.roles;
    public email:           string;
    public title:           any[]   = this.data.description;
    public users:           any     = new MatTableDataSource();
    public filter:          any     = {
        'email': ''
    };
    public search:          boolean;
    public columns:         any[]   = ['email', 'role', 'options'];
    public loading:         boolean;
    public service:         any     = this.data.service;
    public language:        string  = this.translate.language.value;
    private subscriptions:  any     = {};
    
    public close() {
        this.dialog.close(false);
    };

    public ToggleSearch() {
        this.search         = !this.search;
        this.filter.email   = '';
        if (this.search) {
            setTimeout(() => {
                this.searchbox.nativeElement.focus();
            }, 100);
        };
    };
    
    private async get() {
        this.loading = true;

        let params: any = {};

        if (this.type == 'mimic') {
            params.filter = [
                'role',
                'users',
                'mimicId',
                'description'
            ];
            params.mimicId = this.data.mimicId;
        };

        if (this.type == 'group') {
            params.filter = [
                'role',
                'users',
                'groupId',
                'description'
            ];
            params.groupId = this.data.groupId;
        };

        if (this.type == 'report') {
            params.filter = [
                'role',
                'users',
                'reportId',
                'description'
            ];
            params.reportId = this.data.reportId;
        };

        if (this.type == 'system') {
            params.filter = [
                'role',
                'users',
                'systemId',
                'description'
            ];
            params.systemId = this.data.systemId;
        };

        if (this.type == 'device') {
            params.filter = [
                'role',
                'users',
                'deviceId',
                'description'
            ];
            params.deviceId = this.data.deviceId;
        };

        const response = await this.service.get(params);
      
        this.loading = false;

        if (response.ok) { 
            this.role       = response.result.role;
            this.users.data = response.result.users;
        } else {
            this.close();
        };
    };

    public FilterUsers(email) {
        this.users.filter = email.trim().toLowerCase();
    };

    public async remove(params) {
        this.loading = true;

        if (this.type == 'mimic') {
            params.mimicId = this.data.mimicId;
        };

        if (this.type == 'group') {
            params.groupId = this.data.groupId;
        };

        if (this.type == 'report') {
            params.reportId = this.data.reportId;
        };

        if (this.type == 'system') {
            params.systemId = this.data.systemId;
        };

        if (this.type == 'device') {
            params.deviceId = this.data.deviceId;
        };

        const response = await this.service.unsubscribe(params);
      
        this.loading = false;

        if (response.ok) { 
            for (var i = 0; i < this.users.data.length; ++i) {
                if (this.users.data[i].email == params.email) {
                    this.users.data.splice(i, 1);
                    break;
                };
            };
            this.users.data = JSON.parse(JSON.stringify(this.users.data));
        } else {
            // show error
        };
    };

    public async updatesubscriber(role, email) {
        this.loading = true;

        let params: any = {
            'role':  role,
            'email': email
        };

        if (this.type == 'mimic') {
            params.mimicId = this.data.mimicId;
        };

        if (this.type == 'group') {
            params.groupId = this.data.groupId;
        };

        if (this.type == 'report') {
            params.reportId = this.data.reportId;
        };

        if (this.type == 'system') {
            params.systemId = this.data.systemId;
        };

        if (this.type == 'device') {
            params.deviceId = this.data.deviceId;
        };

        const response = await this.service.updatesubscriber(params);
      
        this.loading = false;

        if (response.ok) {
            // show success
        } else {
            // show error
        };
    };

    ngOnInit() {
        this.email = this.localstorage.get('email');
        
        this.get();

		this.subscriptions.language = this.translate.language.subscribe(language => {
			this.language = language;
		});
    };

    ngOnDestroy() {
        this.subscriptions.language.unsubscribe();
    };
}