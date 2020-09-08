import { Widget } from 'src/app/interfaces/report';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit, Inject, Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-widget-dialog',
    styleUrls: ['./widget.dialog.scss'],
    templateUrl: './widget.dialog.html'
})

export class WidgetDialog implements OnInit, OnDestroy {

    constructor(private dialog: MatDialogRef<WidgetDialog>, @Inject(MAT_DIALOG_DATA) private widget: Widget, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'label': new FormGroup({
            'position': new FormGroup({
                'vertical': new FormControl(this.widget.label.position.vertical, [Validators.required]),
                'horizontal': new FormControl(this.widget.label.position.horizontal, [Validators.required])
            }),
            'value': new FormControl(this.widget.label.value, [Validators.required]),
            'visable': new FormControl(this.widget.label.visable, [Validators.required])
        }),
        'connector': new FormGroup({}),
        'widgetId': new FormControl(this.widget.widgetId, [Validators.required])
    });
    public errors: any = {
        'label': {
            'position': {
                'vertical': '',
                'horizontal': ''
            },
            'value': '',
            'visable': ''
        },
        'connector': {},
        'widgetId': ''
    };
    private subscriptions: any = {};

    public close() {
        this.dialog.close(false);
    };

    public submit() {
        this.dialog.close(this.form.value);
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