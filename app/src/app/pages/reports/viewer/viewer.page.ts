import canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import * as moment from 'moment';
import { Report } from 'src/app/interfaces/report';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from 'src/app/services/history/history.service';
import { OnInit, Component, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
    selector: 'app-report-viewer-page',
    styleUrls: ['./viewer.page.scss'],
    templateUrl: './viewer.page.html'
})

export class ReportViewerPage implements OnInit, OnDestroy {

    @ViewChild('frame', {'static': true}) private frame: ElementRef;

    constructor(private route: ActivatedRoute, private toast: ToastService, public history: HistoryService, private service: ReportsService) { };

    @HostListener('window:resize', ['$event']) function() {
        this.SetLayout();
    };

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

    private async load() {
        this.loading = true;

        await this.report.widgets.reduce(async (promise, widget, index) => {
            const response = await this.service.load(widget);
            if (response.ok) {
                widget.data = response.result;
            };
        }, Promise.resolve());

        this.loading = false;
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