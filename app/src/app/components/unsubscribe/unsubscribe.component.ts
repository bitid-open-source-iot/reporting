import { TranslateService } from '@bitid/translate';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit, Inject, Component, OnDestroy } from '@angular/core';

@Component({
    selector:       'app-unsubscribe',
    styleUrls:      ['./unsubscribe.component.scss'],
    templateUrl:    './unsubscribe.component.html'
})

export class UnsubscribeComponent implements OnInit, OnDestroy {
    
    constructor(private dialog: MatDialogRef<UnsubscribeComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private translate: TranslateService, private formerror: FormErrorService) {}
    
    public form:            FormGroup   = new FormGroup({
        'confirm':  new FormControl(false, [Validators.required])
    });
    public title:           string      = this.data.description;
    public errors:          any         = {
        'confirm':  ''
    };
    public options:         any         = [
        {
            'value':       true,
            'description': 'yes, unsubscribe me now'
        }, {
            'value':       false,
            'description': 'no, dont unsubscribe me'
        }
    ];
    public language:        string      = this.translate.language.value;
    private subscriptions:  any         = {};
    
    public close() {
        this.dialog.close(false);
    };

    public submit() {
        this.dialog.close(this.form.value.confirm);
    };

    ngOnInit() {
        this.subscriptions.form = this.form.valueChanges.subscribe((data) => {
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