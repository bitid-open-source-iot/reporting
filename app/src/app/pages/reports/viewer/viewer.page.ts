import { DateGroup } from 'src/app/date-group';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from 'src/app/services/history/history.service';
import { Report, ReportLayout, ReportSettings } from 'src/app/utilities/report';
import { OnInit, Component, OnDestroy, HostListener } from '@angular/core';

@Component({
    selector: 'report-viewer-page',
    styleUrls: ['./viewer.page.scss'],
    templateUrl: './viewer.page.html'
})

export class ReportViewerPage implements OnInit, OnDestroy {

    @HostListener('window:resize', ['$event']) function() {
        this.set();
    };

    constructor(private route: ActivatedRoute, private toast: ToastService, public history: HistoryService, private service: ReportsService) { };

    public period: any = {
        'tense': 'current',
        'frame': 'month'
    };
    public date: any = new DateGroup(new Date(), new Date());
    public layout: string;
    public report: Report = new Report();
    public loading: boolean;
    public reportId: string;
    private subscriptions: any = {};

    private set() {
        const width = window.innerWidth;
        if (width <= 400) {
            this.layout = 'mobile';
        } else if (width > 400 && width <= 1000) {
            this.layout = 'tablet';
        } else if (width > 1000) {
            this.layout = 'desktop';
        };
    };

    private async get() {
        this.loading = true;

        const response = await this.service.get({
            'filter': [
                'role',
                'layout',
                'reporId',
                'settings',
                'description'
            ],
            'reportId': this.reportId
        });

        if (response.ok) {
            this.report.layout = new ReportLayout(response.result.layout);
            this.report.settings = new ReportSettings(response.result.settings);
            this.report.description = response.result.description;
            this.load();
        } else {
            this.toast.error(response.error.message);
            this.history.back();
        };

        this.loading = false;
    };

    private async load() {
        this.report.layout[this.layout].map(row => {
            row.columns.map(async column => {
                if (column.type == 'value') {
                    column.loading = true;
                    const response = await this.service.load({
                        'date': {
                            'to': new Date(2020, 11, 31),
                            'from': new Date(2020, 0, 1)
                        },
                        'type': column.type,
                        'inputId': column.inputId,
                        'deviceId': column.deviceId,
                        'expression': column.expression
                    });
                    if (response.ok) {
                        if (response.result.type == 'analog') {
                            column.value = [response.result.value.toFixed(response.result.analog.decimals || 0), '<small>', response.result.analog.units, '</small>'].join('');
                        } else if (response.result.type == 'digital') {
                            if (response.result.value == 0) {
                                column.value = response.result.digital.low;
                            } else if (response.result.value == 1) {
                                column.value = response.result.digital.high;
                            } else {
                                column.value = '❗';
                            };
                        } else {
                            column.value = '❗';
                        };
                    } else {
                        column.value = '❗';
                    };
                    column.loading = false;
                } else if (column.type == 'chart') {
                    column.series.map(async series => {
                        const response = await this.service.load({
                            'date': {
                                'to': new Date(2020, 11, 31),
                                'from': new Date(2020, 0, 1)
                            },
                            'type': column.type,
                            'inputId': series.inputId,
                            'deviceId': series.deviceId
                        });
                        if (response.ok) {
                            if (response.result.type == 'analog') {
                                series.data = response.result.value;
                            } if (response.result.type == 'digital') {
                                series.data = response.result.value;
                            } else {
                                series.data = [];
                            };
                        } else {
                            series.data = [];
                        };
                    });
                };
            });
        });
    };

    ngOnInit(): void {
        this.set();

        this.subscriptions.route = this.route.queryParams.subscribe(params => {
            this.reportId = params.reportId;
            this.get();
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.route.unsubscribe();
    };

}