import { FormErrorService }  from '../../services/form-error/form-error.service';
import { TranslateService } from '@bitid/translate';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit, Inject, Component, OnDestroy } from '@angular/core';

@Component({
    selector:       'app-remove',
    styleUrls:      ['./remove.component.scss'],
    templateUrl:    './remove.component.html'
})

export class RemoveComponent implements OnInit, OnDestroy {
    
    constructor(private dialog: MatDialogRef<RemoveComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private translate: TranslateService, private formerror: FormErrorService) {}
    
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
            'description': 'yes, delete it now'
        }, {
            'value':       false,
            'description': 'no, dont delete it'
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