import { Report } from 'src/app/interfaces/report';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AccountService } from 'src/app/services/account/account.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareComponent } from 'src/app/components/share/share.component';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { SearchComponent } from 'src/app/components/search/search.component';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';
import { UnsubscribeComponent } from 'src/app/components/unsubscribe/unsubscribe.component';
import { BottomSheetComponent } from 'src/app/components/bottom-sheet/bottom-sheet.component';
import { OnInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { SubscribersComponent } from 'src/app/components/subscribers/subscribers.component';

@Component({
    selector: 'app-reports-page',
    styleUrls: ['./reports.page.scss'],
    templateUrl: './reports.page.html'
})

export class ReportsPage implements OnInit, OnDestroy {

    @ViewChild(SearchComponent, { 'static': true }) private search: SearchComponent;

    constructor(private toast: ToastService, private sheet: MatBottomSheet, private account: AccountService, private dialog: MatDialog, private router: Router, private service: ReportsService, private localstorage: LocalstorageService) { };

    public sort: any = {
        'key': 'description',
        'reverse': false
    };
    public filter: string = '';
    public reports: Report[] = [];
    public loading: boolean;
    private subscriptions: any = {};

    public async logout() {
        this.account.logout();
    };

    public async add(type: string) {
        this.loading = true;

        const response = await this.service.add({
            'layout': {
                'mobile': {
                    'rows': []
                },
                'tablet': {
                    'rows': []
                },
                'desktop': {
                    'rows': []
                }
            },
            'theme': {
                'name': 'dark',
                'type': 'default',
                'color': 'rgba(255, 255, 255, 1)',
                'board': 'rgba(0, 0, 0, 1)',
                'column': 'rgba(255, 255, 255, 0.25)'
            },
            'type': type,
            'widgets': [],
            'description': 'Untitled Report'
        });

        this.loading = false;

        if (response.ok) {
            this.router.navigate(['/reports', 'editor'], {
                'queryParams': {
                    'mode': 'update',
                    'reportId': response.result.reportId
                }
            });
            this.toast.success('new report created!');
        } else {
            this.toast.error(response.error.message);
        };
    };

    private async list() {
        this.loading = true;

        const response = await this.service.list({
            'sort': {
                [this.sort.key]: (this.sort.reverse ? -1 : 1)
            },
            'filter': [
                'role',
                'reportId',
                'description'
            ],
            'type': ['ds', 'dashboard']
        });

        this.loading = false;

        if (response.ok) {
            this.reports = response.result;
        } else {
            this.reports = [];
        };
    };

    public async options(report: Report) {
        const sheet = await this.sheet.open(BottomSheetComponent, {
            'data': {
                'role': report.role,
                'title': report.description,
                'options': [
                    {
                        'icon': 'view',
                        'title': 'view',
                        'disabled': [0],
                        'optionId': 0
                    },
                    {
                        'icon': 'edit',
                        'title': 'edit',
                        'disabled': [0, 1],
                        'optionId': 1
                    },
                    {
                        'icon': 'copy',
                        'title': 'copy',
                        'disabled': [0, 1],
                        'optionId': 2
                    },
                    {
                        'icon': 'share',
                        'title': 'Share',
                        'disabled': [0, 1, 2, 3],
                        'optionId': 3
                    },
                    {
                        'icon': 'subscribers',
                        'title': 'subscribers',
                        'disabled': [0, 1, 2, 3],
                        'optionId': 4
                    },
                    {
                        'icon': 'delete',
                        'color': '#F44336',
                        'title': 'delete',
                        'disabled': [0, 1, 2, 3, 4],
                        'optionId': 5
                    },
                    {
                        'icon': 'unsubscribe',
                        'color': '#F44336',
                        'title': 'unsubscribe',
                        'disabled': [0, 5],
                        'optionId': 6
                    }
                ]
            }
        });

        await sheet.afterDismissed().subscribe(async optionId => {
            if (typeof (optionId) !== "undefined") {
                switch (optionId) {
                    case (0):
                        this.router.navigate(['/reports', 'viewer'], {
                            'queryParams': {
                                'reportId': report.reportId
                            }
                        });
                        break;
                    case (1):
                        this.router.navigate(['/reports', 'editor'], {
                            'queryParams': {
                                'mode': 'update',
                                'reportId': report.reportId
                            }
                        });
                        break;
                    case (2):
                        this.loading = true;

                        const response = await this.service.add({
                            'layout': report.layout || {
                                'mobile': {
                                    'rows': []
                                },
                                'tablet': {
                                    'rows': []
                                },
                                'desktop': {
                                    'rows': []
                                }
                            },
                            'type': 'dashboard',
                            'widgets': report.widgets || [],
                            'description': report.description || 'Untitled Report'
                        });

                        this.loading = false;

                        if (response.ok) {
                            this.router.navigate(['/reports', 'editor'], {
                                'queryParams': {
                                    'mode': 'update',
                                    'reportId': response.result.reportId
                                }
                            });
                            this.toast.success('report created from ' + report.description);
                        } else {
                            this.toast.error(response.error.message);
                        };
                        break;
                    case (3):
                        const share = await this.dialog.open(ShareComponent, {
                            'panelClass': 'share-dialog',
                            'disableClose': true
                        });

                        await share.afterClosed().subscribe(async user => {
                            if (user) {
                                this.loading = true;

                                const response = await this.service.share({
                                    'role': user.role,
                                    'email': user.email,
                                    'reportId': report.reportId
                                });

                                this.loading = false;

                                if (response.ok) {
                                    this.toast.success('user shared to report!');
                                } else {
                                    this.toast.error('unable to share user to report!');
                                };
                            };
                        });
                        break;
                    case (4):
                        this.dialog.open(SubscribersComponent, {
                            'data': {
                                'id': report.reportId,
                                'type': 'report',
                                'service': this.service
                            },
                            'panelClass': 'fullscreen-dialog',
                            'disableClose': true
                        });
                        break;
                    case (5):
                        const remove = await this.dialog.open(DeleteComponent, {
                            'panelClass': 'delete-dialog',
                            'disableClose': true
                        });

                        await remove.afterClosed().subscribe(async user => {
                            if (user) {
                                this.loading = true;

                                const response = await this.service.delete({
                                    'reportId': report.reportId
                                });

                                this.loading = false;

                                if (response.ok) {
                                    this.toast.success('report was deleted!');
                                    for (let i = 0; i < this.reports.length; i++) {
                                        if (this.reports[i].reportId == report.reportId) {
                                            this.reports.splice(i, 1);
                                            break;
                                        };
                                    };
                                } else {
                                    this.toast.error('issue deleting report!');
                                };
                            };
                        });
                        break;
                    case (6):
                        const unsubscribe = await this.dialog.open(UnsubscribeComponent, {
                            'panelClass': 'unsubscribe-dialog',
                            'disableClose': true
                        });

                        await unsubscribe.afterClosed().subscribe(async user => {
                            if (user) {
                                this.loading = true;

                                const response = await this.service.unsubscribe({
                                    'email': this.localstorage.get('email'),
                                    'reportId': report.reportId
                                });

                                this.loading = false;

                                if (response.ok) {
                                    this.toast.success('unsubscribed from report!');
                                    for (let i = 0; i < this.reports.length; i++) {
                                        if (this.reports[i].reportId == report.reportId) {
                                            this.reports.splice(i, 1);
                                            break;
                                        };
                                    };
                                } else {
                                    this.toast.error('issue unsubscribing from report!');
                                };
                            };
                        });
                        break;
                };
            };
        });
    };

    ngOnInit(): void {
        this.subscriptions.search = this.search.change.subscribe(filter => {
            this.filter = filter;
        });

        this.list();
    };

    ngOnDestroy(): void {
        this.subscriptions.search.unsubscribe();
    };

}