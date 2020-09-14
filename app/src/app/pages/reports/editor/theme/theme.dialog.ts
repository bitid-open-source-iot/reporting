import { Theme } from 'src/app/interfaces/theme';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OnInit, Inject, Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-theme-dialog',
    styleUrls: ['./theme.dialog.scss'],
    templateUrl: './theme.dialog.html'
})

export class ThemeDialog implements OnInit, OnDestroy {

    constructor(private dialog: MatDialogRef<ThemeDialog>, @Inject(MAT_DIALOG_DATA) public theme: Theme) { };

    public themes: Theme[] = [
        {
            'name': 'dark',
            'color': 'rgba(255, 255, 255, 1)',
            'board': 'rgba(0, 0, 0, 1)',
            'column': 'rgba(255, 255, 255, 0.25)'
        },
        {
            'name': 'light',
            'color': 'rgba(0, 0, 0, 1)',
            'board': 'rgba(255, 255, 255, 1)',
            'column': 'rgba(0, 0, 0, 0.05)'
        }
    ];

    public close() {
        this.dialog.close(false);
    };

    public submit(theme) {
        this.dialog.close(theme);
    };

    ngOnInit(): void { };

    ngOnDestroy(): void { };

}