import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AccountService } from 'src/app/services/account/account.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareComponent } from 'src/app/components/share/share.component';
import { Report, REPORT, ReportSettings } from 'src/app/utilities/report';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { SearchComponent } from 'src/app/components/search/search.component';
import { MatTableDataSource } from '@angular/material/table';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';
import { UnsubscribeComponent } from 'src/app/components/unsubscribe/unsubscribe.component';
import { BottomSheetComponent } from 'src/app/components/bottom-sheet/bottom-sheet.component';
import { SubscribersComponent } from 'src/app/components/subscribers/subscribers.component';
import { OnInit, Component, OnDestroy, ViewChild } from '@angular/core';

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
    public columns: string[] = ['description', 'mobile', 'tablet', 'desktop'];
    public reports: MatTableDataSource<REPORT> = new MatTableDataSource<REPORT>();
    public loading: boolean;
    private subscriptions: any = {};

    public async add() {
        this.loading = true;

        const report = new Report({
            'settings': new ReportSettings({
                'fill': {
                    'color': '#FFFFFF',
                    'opacity': 25
                },
                'font': {
                    'color': '#FFFFFF',
                    'opacity': 100
                },
                'stroke': {
                    'color': '#FFFFFF',
                    'opacity': 100
                },
                'board': {
                    'color': '#000000',
                    'opacity': 100
                },
                'banner': {
                    'color': '#FFFFFF',
                    'opacity': 100
                }
            }),
            'description': 'Untitled Report'
        });

        const response = await this.service.add(report);

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
                'views',
                'reportId',
                'description'
            ]
        });

        this.loading = false;

        if (response.ok) {
            this.reports.data = response.result;
        } else {
            this.reports.data = [];
        };
    };

    public async logout() {
        this.account.logout();
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
                                'reportId': report.reportId
                            }
                        });
                        break;
                    case (2):
                        this.loading = true;

                        const item = await this.service.get({
                            'filter': [
                                'role',
                                'layout',
                                'settings',
                                'description'
                            ],
                            'reportId': report.reportId
                        });

                        if (item.ok) {
                            if (item.result.role > 3) {
                                const response = await this.service.add({
                                    'layout': item.result.layout,
                                    'settings': item.result.settings,
                                    'description': item.description
                                });
                                if (response.ok) {
                                    this.router.navigate(['/reports', 'editor'], {
                                        'queryParams': {
                                            'reportId': response.result.reportId
                                        }
                                    });
                                    this.toast.success('Report was copied!');
                                } else {
                                    this.toast.error(response.error.message);
                                };
                            } else {
                                this.toast.error('Access to clone report denied!');
                            };
                        } else {
                            this.toast.error(item.error.message);
                        };

                        this.loading = false;
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
                                    for (let i = 0; i < this.reports.data.length; i++) {
                                        if (this.reports.data[i].reportId == report.reportId) {
                                            this.reports.data.splice(i, 1);
                                            break;
                                        };
                                    };
                                    this.reports.data = JSON.parse(JSON.stringify(this.reports.data));
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
                                    for (let i = 0; i < this.reports.data.length; i++) {
                                        if (this.reports.data[i].reportId == report.reportId) {
                                            this.reports.data.splice(i, 1);
                                            break;
                                        };
                                    };
                                    this.reports.data = JSON.parse(JSON.stringify(this.reports.data));
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
            this.reports.filter = filter;
        });

        this.list();
    };

    ngOnDestroy(): void {
        this.subscriptions.search.unsubscribe();
    };

}