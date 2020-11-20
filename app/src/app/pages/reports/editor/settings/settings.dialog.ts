import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportSettings, REPORTSETTINGS } from 'src/app/utilities/report';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Inject, OnInit, Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'report-settings-dialog',
    styleUrls: ['./settings.dialog.scss'],
    templateUrl: './settings.dialog.html'
})

export class ReportSettingsDialog implements OnInit, OnDestroy {

    constructor(private dialog: MatDialogRef<ReportSettingsDialog>, @Inject(MAT_DIALOG_DATA) private settings: REPORTSETTINGS, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'fill': new FormGroup({
            'color': new FormControl('#000000', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)])
        }),
        'font': new FormGroup({
            'size': new FormControl(24, [Validators.required, Validators.min(24), Validators.max(48)]),
            'color': new FormControl('#FFFFFF', [Validators.required]),
            'family': new FormControl('Arial', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)]),
            'vertical': new FormControl('center', [Validators.required]),
            'horizontal': new FormControl('center', [Validators.required])
        }),
        'board': new FormGroup({
            'color': new FormControl('#000000', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)])
        }),
        'stroke': new FormGroup({
            'width': new FormControl(0, [Validators.required, Validators.min(0), Validators.max(5)]),
            'style': new FormControl('solid', [Validators.required]),
            'color': new FormControl('#000000', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)])
        }),
        'banner': new FormGroup({
            'size': new FormControl(12, [Validators.required, Validators.min(8), Validators.max(24)]),
            'color': new FormControl('#FFFFFF', [Validators.required]),
            'family': new FormControl('Arial', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)]),
            'vertical': new FormControl('top', [Validators.required]),
            'horizontal': new FormControl('left', [Validators.required])
        })
    });
    public errors: any = {
        'fill': {
            'color': '',
            'opacity': ''
        },
        'font': {
            'size': '',
            'color': '',
            'family': '',
            'opacity': '',
            'vertical': '',
            'horizontal': ''
        },
        'board': {
            'color': '',
            'opacity': ''
        },
        'stroke': {
            'width': '',
            'style': '',
            'color': '',
            'opacity': ''
        },
        'banner': {
            'size': '',
            'color': '',
            'family': '',
            'opacity': '',
            'vertical': '',
            'horizontal': ''
        }
    };
    private subscriptions: any = { };

    public close() {
        this.dialog.close(this.form.value);
    };

    private async set() {
        this.settings = new ReportSettings(this.settings);
        this.form.setValue(this.settings);
    };

    ngOnInit(): void {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });
        
        this.set();
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
    };

}