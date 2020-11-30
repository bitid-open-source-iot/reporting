import * as moment from 'moment';
import { DateGroup } from 'src/app/date-group';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from 'src/app/services/history/history.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

    constructor(private route: ActivatedRoute, private toast: ToastService, public history: HistoryService, private service: ReportsService, private formerror: FormErrorService) { };

    public date: DateGroup = new DateGroup({
        'to': new Date(),
        'from': new Date(new Date().setMonth(new Date().getMonth() - 1))
    });
    public form: FormGroup = new FormGroup({
        'to': new FormControl(null, [Validators.required]),
        'from': new FormControl(null, [Validators.required])
    });
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
            this.report.role = response.result.role;
            this.report.layout = new ReportLayout(response.result.layout);
            this.report.settings = new ReportSettings(response.result.settings);
            this.report.description = response.result.description;
            Object.keys(this.report.layout).map(layout => {
                this.report.layout[layout].map(row => {
                    row.columns.map(column => {
                        if (column.type == 'value') {
                            column.handler = async (date) => {
                                column.loading = true;

                                const response = await this.service.load({
                                    'date': date,
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
                            };
                        } else if (column.type == 'chart') {
                            column.series.map(series => {
                                series.handler = async (date) => {
                                    const response = await this.service.load({
                                        'date': date,
                                        'type': column.type,
                                        'inputId': series.inputId,
                                        'deviceId': series.deviceId
                                    });
                                    if (response.ok) {
                                        if (response.result.type == 'analog') {
                                            series.data = response.result.value.map(o => {
                                                return {
                                                    'date': moment(o.date).format('YYYY-MM-DD'),
                                                    'value': o.value
                                                };
                                            });
                                        } if (response.result.type == 'digital') {
                                            series.data = response.result.value.map(o => {
                                                return {
                                                    'date': moment(o.date).format('YYYY-MM-DD'),
                                                    'value': o.value
                                                };
                                            });
                                        };
                                    };
                                };
                            });
                        };
                        column.conditions.map(condition => {
                            condition.handler = async (date) => {
                                const response = await this.service.load({
                                    'date': date,
                                    'type': 'value',
                                    'inputId': condition.inputId,
                                    'deviceId': condition.deviceId,
                                    'expression': 'last-value'
                                });

                                if (response.ok) {
                                    column.fill = condition.fill;
                                    column.font = condition.font;
                                    column.stroke = condition.stroke;
                                    column.banner = condition.banner;
                                } else {
                                    column.restore();
                                };
                            };
                        });
                    });
                });
            });
            
            this.form.setValue({
                'to': moment(this.date.to).format('YYYY-MM-DD'),
                'from': moment(this.date.from).format('YYYY-MM-DD')
            });
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
                    column.handler(this.date);
                } else if (column.type == 'chart') {
                    column.series.map(async series => {
                        series.handler(this.date);
                    });
                };
                column.conditions.map(condition => {
                    condition.handler(this.date);
                });
            });
        });
    };

    ngOnInit(): void {
        this.set();

        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.date = new DateGroup(data);
            this.load();
        });

        this.subscriptions.route = this.route.queryParams.subscribe(params => {
            this.reportId = params.reportId;
            this.get();
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
        this.subscriptions.route.unsubscribe();
    };

}