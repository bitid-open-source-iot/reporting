import { MatDialogRef } from '@angular/material/dialog';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'confirm-update-dialog',
    styleUrls: ['./confirm.dialog.scss'],
    templateUrl: './confirm.dialog.html',
    encapsulation: ViewEncapsulation.None
})

export class ConfirmUpdateDialog {

    constructor(private dialog: MatDialogRef<ConfirmUpdateDialog>) { };

    public close() {
        this.dialog.close(false);
    };

    public confirm() {
        this.dialog.close(true);
    };

}