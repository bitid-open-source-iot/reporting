import { Router } from '@angular/router';
import { MenuService } from 'src/app/services/menu/menu.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ShareComponent } from 'src/app/components/share/share.component';
import { RemoveComponent } from 'src/app/components/remove/remove.component';
import { TranslateService } from '@bitid/translate';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';
import { SubscribersComponent } from 'src/app/components/subscribers/subscribers.component';
import { UnsubscribeComponent } from 'src/app/components/unsubscribe/unsubscribe.component';
import { OptionsSheetComponent } from 'src/app/components/options-sheet/options-sheet.component';
import { MatDialog, MatBottomSheet } from '@angular/material';
import { OnInit, OnDestroy, Component, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector:       'app-reports',
    styleUrls:      ['./reports.component.scss'],
    templateUrl:    './reports.component.html'
})

export class ReportsComponent implements OnInit, OnDestroy {

    @ViewChild('searchbox', {'static': true}) private searchbox: ElementRef;

    constructor(public menu: MenuService, private dialog: MatDialog, private sheet: MatBottomSheet, private router: Router, private service: ReportsService, private translate: TranslateService, private localstorage: LocalstorageService) {};

    public filter:          any     = {
        'sort': {
            'key':      'description',
            'reverse':  false
        },
        'search': {
            'description': ''
        }
    };
    public search:          boolean;
    public reports:         any[]   = [];
    public loading:         boolean;
    public language:        string  = this.translate.language.value;
    private subscriptions:  any     = {};

    private async list() {
        this.loading = true;
        
        const response = await this.service.list({
            'filter': [
                'role',
                'type',
                'reportId',
                'description'
            ]
        });

        this.loading = false;

        if (response.ok) {
            this.reports = response.result;
        };
    };

    public ToggleSearch() {
        this.search                     = !this.search;
        this.filter.search.description  = '';

        if (this.search) {
            setTimeout(() => this.searchbox.nativeElement.focus(), 100);
        };
    };

    public async options(report) {
        let items: any[] = [
            {
                'icon':   'remove_red_eye',
                'role':   report.role,
                'scope':  1,
                'title':  'View',
                'color':  'primary',
                'option': 1
            },
            {
                'icon':   'mode_edit',
                'role':   report.role,
                'scope':  2,
                'title':  'Edit',
                'color':  'primary',
                'option': 2
            },
            {
                'icon':   'insert_drive_file',
                'role':   report.role,
                'scope':  2,
                'title':  'Copy',
                'color':  'primary',
                'option': 3
            },
            {
                'icon':   'share',
                'role':   report.role,
                'scope':  4,
                'title':  'Share',
                'color':  'primary',
                'option': 4
            },
            {
                'icon':   'supervisor_account',
                'role':   report.role,
                'scope':  4,
                'title':  'Subscribers',
                'color':  'primary',
                'option': 5
            },
            {
                'icon':   'delete',
                'role':   report.role,
                'scope':  4,
                'title':  'Delete',
                'color':  'warn',
                'option': 6
            },
            {
                'icon':   'remove_circle',
                'role':   report.role,
                'scope':  1,
                'title':  'Unsubscribe',
                'color':  'warn',
                'option': 7
            }
        ];

        this.sheet.open(OptionsSheetComponent, {
            'data': {
                'items':        items,
                'description':  report.description
            },
            'ariaLabel': 'Options'
        }).afterDismissed().subscribe(async (option) => {
            if (option) {
                switch(option) {
                    case(1):
                        this.router.navigate(['reports', 'view', report.reportId]);
                        break;
                    case(2):
                        this.router.navigate(['reports', 'update', report.reportId]);
                        break;
                    case(3):
                        this.router.navigate(['reports', 'copy', report.reportId]);
                        break;
                    case(4):
                        this.dialog.open(ShareComponent, {
                            'data': {
                                'users':       report.users,
                                'description': report.description
                            },
                            'panelClass':   'share-dialog',
                            'disableClose': true
                        }).afterClosed().subscribe(async (user) => {
                            if (typeof(user) != "undefined") {
                                this.loading = true;
                                
                                const response = await this.service.share({
                                    'role':     user.role,
                                    'email':    user.email,
                                    'reportId': report.reportId
                                });

                                this.loading = false;

                                if (response.ok) {
                                    // show success
                                } else {
                                    // show error
                                };
                            };
                        });
                        break;
                    case(5):
                        this.dialog.open(SubscribersComponent, {
                            'data': {
                                'type':        'report',
                                'service':     this.service,
                                'reportId':    report.reportId,
                                'description': report.description
                            },
                            'panelClass':   'mat-dialog-fullscreen',
                            'disableClose': true
                        });
                        break;
                    case(6):
                        this.dialog.open(RemoveComponent, {
                            'data': {
                                'description': report.description
                            },
                            'panelClass':   'delete-dialog',
                            'disableClose': true
                        }).afterClosed().subscribe(async (confirmed) => {
                            if (confirmed) {
                                this.loading = true;
                                
                                const response = await this.service.delete({
                                    'reportId': report.reportId
                                });

                                this.loading = false;

                                if (response.ok) {
                                    for (let i = 0; i < this.reports.length; i++) {
                                        if (this.reports[i].reportId == report.reportId) {
                                            this.reports.splice(i, 1);
                                            break;
                                        };
                                    };
                                } else {
                                    // show error
                                };
                            };
                        });
                        break;
                    case(7):
                        this.dialog.open(UnsubscribeComponent, {
                            'data': {
                                'description': report.description
                            },
                            'panelClass':   'unsubscribe-dialog',
                            'disableClose': true
                        }).afterClosed().subscribe(async (confirmed) => {
                            if (confirmed) {
                                this.loading = true;
                                
                                const response = await this.service.unsubscribe({
                                    'email':    this.localstorage.get('email'),
                                    'reportId': report.reportId
                                });

                                this.loading = false;

                                if (response.ok) {
                                    for (let i = 0; i < this.reports.length; i++) {
                                        if (this.reports[i].reportId == report.reportId) {
                                            this.reports.splice(i, 1);
                                            break;
                                        };
                                    };
                                    // show success
                                } else {
                                    // show error
                                };
                            };
                        });
                        break;
                }
            };
        });
    };

    ngOnInit() {
        this.list();

        this.subscriptions.translate = this.translate.language.subscribe(language => {
            this.language = language;
        });
    };

    ngOnDestroy() {
        this.subscriptions.translate.unsubscribe();
    };

}