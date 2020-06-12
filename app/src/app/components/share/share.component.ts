import { environment } from 'src/environments/environment';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { TranslateService } from '@bitid/translate';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Inject, OnInit, Component, OnDestroy } from '@angular/core';

@Component({
    selector:     'share',
    styleUrls:    ['./share.component.scss'],
    templateUrl:  './share.component.html'
})

export class ShareComponent implements OnInit, OnDestroy {
    
    constructor(private dialog: MatDialogRef<ShareComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private translate: TranslateService, private formerror: FormErrorService) {}
    
    public form:            FormGroup   = new FormGroup({
        'role':  new FormControl('', [Validators.required]),
        'email': new FormControl('', [Validators.required, Validators.email]),
    });
    public roles:           any         = environment.roles;
    public title:           string      = this.data.description;
    public errors:          any         = {
        'role':     '',
        'email':    ''
    };
    public language:        string      = this.translate.language.value;
    private subscriptions:  any         = {};
    
    public close() {
        this.dialog.close(false);
    };

    public submit() {
        this.dialog.close({
            'role':  this.form.value.role,
            'email': this.form.value.email
        });
    };

    ngOnInit() {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });

		this.subscriptions.language = this.translate.language.subscribe(language => {
			this.language = language;
		});
    };

    ngOnDestroy() {
        this.subscriptions.form.unsubscribe();
        this.subscriptions.language.unsubscribe();
    };
}