import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { OnInit, Component, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Widget } from 'src/app/interfaces/report';

@Component({
    selector: 'app-link-dialog',
    styleUrls: ['./link.dialog.scss'],
    templateUrl: './link.dialog.html'
})

export class LinkWidgetDialog implements OnInit, OnDestroy {

    constructor(private dialog: MatDialogRef<LinkWidgetDialog>, @Inject(MAT_DIALOG_DATA) private config: any, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'widgetId': new FormControl(this.config.widgetId, [Validators.required])
    });
    public errors: any = {
        'widgetId': ''
    };
    public widgets: Widget[] = this.config.widgets;
    private subscriptions: any = {};

    public close() {
        this.dialog.close(false);
    };

    public submit() {
        this.dialog.close(this.form.value.widgetId);
    };

    ngOnInit(): void {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
    };

}