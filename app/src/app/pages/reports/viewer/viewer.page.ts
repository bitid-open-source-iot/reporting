import canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import * as moment from 'moment';
import { Report } from 'src/app/interfaces/report';
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
            'name': 'dark',
            'color': 'rgba(255, 255, 255, 1)',
            'board': 'rgba(0, 0, 0, 1)',
            'column': 'rgba(255, 255, 255, 0.25)'
        },
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
        'widgets': []
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
            };

            this.report.layout.mobile.rows.map(row => {
                row.columns.map(column => {
                    this.report.widgets.map(widget => {
                        if (column.widgetId == widget.widgetId) {
                            column.widget = widget;
                        };
                    });
                });
            });
            this.report.layout.tablet.rows.map(row => {
                row.columns.map(column => {
                    this.report.widgets.map(widget => {
                        if (column.widgetId == widget.widgetId) {
                            column.widget = widget;
                        };
                    });
                });
            });
            this.report.layout.desktop.rows.map(row => {
                row.columns.map(column => {
                    this.report.widgets.map(widget => {
                        if (column.widgetId == widget.widgetId) {
                            column.widget = widget;
                        };
                    });
                });
            });
            this.load();
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
        
        await this.report.widgets.reduce(async (promise, widget, index) => {
            widget.query.date = this.date;
            const response = await this.service.load(widget);
            if (response.ok) {
                widget.data = response.result;
            } else {
                switch (widget.type) {
                    case('chart'):
                        widget.data = {
                            'value': [],
                            'analog': {},
                            'digital': {}
                        };
                        break;
                    case('value'):
                        widget.data = {
                            'value': 0,
                            'analog': {},
                            'digital': {}
                        };
                        break;
                };
            };
        }, Promise.resolve());

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

    public async download() {
        const element = document.getElementById('dashboard');
        canvas(element).then(canvas => {
            const pdf = new jspdf();
            const image = canvas.toDataURL("image/jpeg");
            pdf.addImage(image, 'JPEG', 0, 0);
            pdf.save(this.report.description.toLocaleUpperCase() + ' (' + moment().format('YYYY-MM-DD') + ')');
        });
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
    };

    ngOnDestroy(): void {
        this.subscriptions.route.unsubscribe();
    };

}