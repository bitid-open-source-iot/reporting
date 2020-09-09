import { Widget } from 'src/app/interfaces/report';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { ConnectorsService } from 'src/app/services/connectors/connectors.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit, Inject, Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-widget-dialog',
    styleUrls: ['./widget.dialog.scss'],
    templateUrl: './widget.dialog.html'
})

export class WidgetDialog implements OnInit, OnDestroy {

    constructor(private dialog: MatDialogRef<WidgetDialog>, @Inject(MAT_DIALOG_DATA) private widget: Widget, public connectors: ConnectorsService, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'label': new FormGroup({
            'value': new FormControl(this.widget.label.value, [Validators.required]),
            'visable': new FormControl(this.widget.label.visable, [Validators.required])
        }),
        'type': new FormControl(this.widget.type, [Validators.required]),
        'widgetId': new FormControl(this.widget.widgetId, [Validators.required]),
        'connectorId': new FormControl(this.widget.connectorId, [Validators.required])
    });
    public errors: any = {
        'label': {
            'value': '',
            'visable': ''
        },
        'type': '',
        'widgetId': '',
        'connectorId': ''
    };
    public loading: boolean;
    private subscriptions: any = {};

    public async load() {
        this.loading = true;

        this.form.disable();

        const response = await this.connectors.list({});

        if (response.ok) {
            this.connectors.data = response.result;
        } else {
            this.connectors.data = [];
        };

        this.form.enable();

        this.loading = false;
    };

    public close() {
        this.dialog.close(false);
    };

    public submit() {
        this.dialog.close(this.form.value);
    };

    ngOnInit(): void {
        this.load();

        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
    };

}