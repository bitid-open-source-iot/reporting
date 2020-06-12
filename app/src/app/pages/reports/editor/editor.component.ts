import { environment } from 'src/environments/environment';
import { MenuService } from 'src/app/services/menu/menu.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { TranslateService } from '@bitid/translate';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OnInit, OnDestroy, Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector:       'app-report-editor',
    styleUrls:      ['./editor.component.scss'],
    templateUrl:    './editor.component.html'
})

export class ReportEditorComponent implements OnInit, OnDestroy {

    constructor(public menu: MenuService, private route: ActivatedRoute, private router: Router, private service: ReportsService, private formerror: FormErrorService, private translate: TranslateService) {};
 
    public form:            FormGroup   = new FormGroup({
        'url':              new FormControl('', [Validators.required]),
        'type':             new FormControl('', [Validators.required]),
        'description':      new FormControl('', [Validators.required]),
        'organizationOnly': new FormControl('', [Validators.required])
    });
    public errors:          any         = {
        'url':              '',
        'type':             '',
        'description':      '',
        'organizationOnly': ''
    };
    public mode:            string;
    public rules:           any[]   = environment.organizationOnly;
    public options:         any[]   = [
        {
            'value':       'pdf',
            'description': 'PDF'
        },
        {
            'value':       'ds',
            'description': 'Data Studio'
        }
    ];
    public loading:         boolean;
    public language:        string  = this.translate.language.value;
    private reportId:       string;
    private subscriptions:  any     = {};

    public async submit() {
        this.loading = true;

        let mode = this.mode;

        if (mode == 'copy') {
            mode = 'add';
        };

        const response = await this.service[mode]({
            'url':              this.form.value.url,
            'type':             this.form.value.type,
            'reportId':         this.reportId,
            'description':      this.form.value.description,
            'organizationOnly': this.form.value.organizationOnly
        });

        this.loading = false;

        if (response.ok) {
            this.router.navigate(['/reports']);
        } else {
            // show error
        };
    };

    private async get() {
        this.loading = true;
        
        const response = await this.service.get({
            'reportId': this.reportId
        });

        this.loading = false;

        if (response.ok) {
            this.form.controls['url'].setValue(response.result.url);
            this.form.controls['type'].setValue(response.result.type);
            this.form.controls['description'].setValue(response.result.description);
            this.form.controls['organizationOnly'].setValue(response.result.organizationOnly);
        } else {
            // show error
        };
    };

    ngOnInit() {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });

        this.subscriptions.route = this.route.params.subscribe(params => {
            this.mode       = params.mode;
            this.reportId   = params.reportId;
            if (this.mode != 'add') {
                this.get();
            };
        });

        this.subscriptions.translate = this.translate.language.subscribe(language => {
            this.language = language;
        });
    };

    ngOnDestroy() {
        this.subscriptions.form.unsubscribe();
        this.subscriptions.route.unsubscribe();
        this.subscriptions.translate.unsubscribe();
    };

}