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
            'font': {
                'color': '#FFFFFF',
                'opacity': 100
            },
            'board': {
                'color': '#000000',
                'opacity': 100
            },
            'column': {
                'color': '#FFFFFF',
                'opacity': 25
            },
            'name': 'dark',
            'type': 'default'
        },
        {
            'font': {
                'color': '#000000',
                'opacity': 100
            },
            'board': {
                'color': '#FFFFFF',
                'opacity': 100
            },
            'column': {
                'color': '#000000',
                'opacity': 5
            },
            'name': 'light',
            'type': 'default'
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