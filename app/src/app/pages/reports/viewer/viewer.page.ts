import { Report } from 'src/app/interfaces/report';
import { interval } from 'rxjs';
import { DateGroup } from 'src/app/date-group';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from 'src/app/services/history/history.service';
import { CustomDatesDialog } from './custom-dates/custom-dates.dialog';
import { OnInit, Component, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
    selector: 'app-report-viewer-page',
    styleUrls: ['./viewer.page.scss'],
    templateUrl: './viewer.page.html'
})

export class ReportViewerPage implements OnInit, OnDestroy {

    @ViewChild('frame', {'static': true}) private frame: ElementRef;

    constructor(private route: ActivatedRoute, private toast: ToastService, private dialog: MatDialog, public history: HistoryService, private service: ReportsService) { };

    @HostListener('window:resize', ['$event']) function() {
        this.SetLayout();
    };

    public period: any = {
        'tense': 'current',
        'frame': 'month'
    };
    public date: any = new DateGroup(new Date(), new Date());
    public layout: string;
    public report: Report = {
        'theme': {
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
        'layout': {
            'mobile': [],
            'tablet': [],
            'desktop': []
        }
    };
    public loading: boolean;
    public reportId: string;
    private subscriptions: any = {};

    private async get() {
        this.loading = true;

        const response = await this.service.get({
            'filter': [
                'url',
                'type',
                'role',
                'theme',
                'layout',
                'widgets',
                'reporId',
                'description'
            ],
            'reportId': this.reportId
        });

        if (response.ok) {
            this.report = response.result;
            
            if (this.report.type == 'ds') {
                this.frame.nativeElement.src = this.report.url;
                this.loading = false;
            } else {
                this.load();
            };
        } else {
            this.toast.error(response.error.message);
            this.history.back();
            this.loading = false;
        };
    };

    public async load() {
        this.loading = true;
        
        if (this.period.tense != 'custom-dates') {
            this.date = new DateGroup(new Date(), new Date());
            const range = [this.period.tense, this.period.frame].join('-');
            switch (range) {
                case('current-day'):
                    break;
                case('previous-day'):
                    this.date.to.setDate(this.date.to.getDate() - 1);
                    this.date.from.setDate(this.date.from.getDate() - 1);
                    break;
                case('current-week'):
                    this.date.to.setDate(this.date.to.getDate() - this.date.to.getDay() + 7);
                    this.date.from.setDate(this.date.from.getDate() - this.date.from.getDay() + 1);
                    break;
                case('previous-week'):
                    this.date.to.setDate(this.date.to.getDate() - this.date.to.getDay());
                    this.date.from.setDate(this.date.from.getDate() - this.date.from.getDay() - 6);
                    break;
                case('current-month'):
                    this.date.to.setDate(new Date(this.date.to.getFullYear(), this.date.to.getMonth() + 1, 0).getDate());
                    this.date.from.setDate(1);
                    break;
                case('previous-month'):
                    this.date.to.setMonth(this.date.to.getMonth() - 1);
                    this.date.from.setMonth(this.date.from.getMonth() - 1);
                    this.date.to.setDate(new Date(this.date.to.getFullYear(), this.date.to.getMonth() + 1, 0).getDate());
                    this.date.from.setDate(1);
                    break;
                case('current-year'):
                    this.date.to.setMonth(11);
                    this.date.from.setMonth(0);
                    this.date.to.setDate(new Date(this.date.to.getFullYear(), this.date.to.getMonth() + 1, 0).getDate());
                    this.date.from.setDate(1);
                    break;
                case('previous-year'):
                    this.date.to.setFullYear(this.date.to.getFullYear() - 1);
                    this.date.from.setFullYear(this.date.from.getFullYear() - 1);
                    this.date.to.setMonth(11);
                    this.date.from.setMonth(0);
                    this.date.to.setDate(new Date(this.date.to.getFullYear(), this.date.to.getMonth() + 1, 0).getDate());
                    this.date.from.setDate(1);
                    break;
            };
        };

        await this.date.process();
        
        await this.report.layout[this.layout].reduce(async (proma, row, a) => await row.columns.reduce(async (promb, column, b) => {
            if (column.display == 'value' || column.display == 'chart') {
                column.loading = true;
                column.query.date = this.date;
                const response = await this.service.load({
                    'query': column.query,
                    'chart': column.chart,
                    'value': column.value,
                    'display': column.display
                });
                if (response.ok) {
                    column.data = response.result;
                    column.error = false;
                    column.loading = false;
                } else {
                    column.error = true;
                    column.loading = false;
                    switch (column.display) {
                        case('chart'):
                            column.data = {
                                'value': [],
                                'analog': {},
                                'digital': {}
                            };
                            break;
                        case('value'):
                            column.data = {
                                'value': 0,
                                'analog': {},
                                'digital': {}
                            };
                            break;
                    };
                };
            };
            if (Array.isArray(column.conditions) && column.conditions.length > 0) {
                return await column.conditions.reduce(async (promc, condition, c) => {
                    if (condition.type != 'default') {
                        const params = {
                            'query': {
                                'date': this.date,
                                'inputId': condition.connector.inputId,
                                'deviceId': condition.connector.deviceId
                            },
                            'value': {
                                'expression': 'last-value'
                            },
                            'display': 'value'
                        };
                        const response = await this.service.load(params);
                        if (response.ok) {
                            condition.data = response.result;
                        } else {
                            condition.data = null;
                        };
                    };
                }, null);
            } else {
                return true;
            };
        }, null), null);

        this.loading = false;
    };

    private SetLayout() {
        const width = window.innerWidth;
        if (width <= 400) {
            this.layout = 'mobile';
        } else if (width > 400 && width <= 1000) {
            this.layout = 'tablet';
        } else if (width > 1000) {
            this.layout = 'desktop';
        };
    };

    public async SelectDates() {
        const dialog = await this.dialog.open(CustomDatesDialog, {
            'data': {
                'to': this.date.to,
                'from': this.date.from
            },
            'panelClass': 'custom-dates-dialog',
            'disableClose': true
        });

        await dialog.afterClosed().subscribe(async result => {
            if (result) {
                this.date.to = new Date(result.to);
                this.date.from = new Date(result.from);
                this.load();
            };
        });
    };

    ngOnInit(): void {
        this.SetLayout();

        this.subscriptions.route = this.route.queryParams.subscribe(params => {
            this.reportId = params.reportId;
            this.get();
        });
    
        this.subscriptions.interval = interval(1000).subscribe(count => {
            this.report.layout[this.layout].map(row => {
                row.columns.map(column => {
                    if (column.display) {
                        let found = false;
                        column.conditions.filter(o => (o.data && o.type == 'connector')).map(condition => {
                            if (condition.connector.type == 'analog' && condition.connector.analog.min <= condition.data.value && condition.connector.analog.max >= condition.data.value) {
                                found = true;
                                column.fill = condition.fill;
                                column.font = condition.font;
                                column.stroke = condition.stroke;
                                column.banner = condition.banner;
                                column.gridlines = condition.gridlines;
                                column.chartfill = condition.chartfill;
                            } else if (condition.connector.type == 'digital' && condition.connector.digital.value <= condition.data.value) {
                                found = true;
                                column.fill = condition.fill;
                                column.font = condition.font;
                                column.stroke = condition.stroke;
                                column.banner = condition.banner;
                                column.gridlines = condition.gridlines;
                                column.chartfill = condition.chartfill;
                            };
                        });
                        if (!found) {
                            column.conditions.filter(o => o.type == 'default').map(condition => {
                                column.fill = condition.fill;
                                column.font = condition.font;
                                column.stroke = condition.stroke;
                                column.banner = condition.banner;
                                column.gridlines = condition.gridlines;
                                column.chartfill = condition.chartfill;
                            });
                        };
                    };
                });
            });
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.route.unsubscribe();
        this.subscriptions.interval.unsubscribe();
    };

}