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
            this.report = new Report(response.result);

            this.form.setValue({
                'to': moment(this.date.to).format('YYYY-MM-DD'),
                'from': moment(this.date.from).format('YYYY-MM-DD')
            });
            
            this.load();
        } else {
            this.toast.error(response.error.message);
            this.history.back();
        };

        this.loading = false;
    };

    public async load() {
        this.loading = true;
        
        let points = [];
        
        this.report.layout[this.layout].map(row => {
            row.columns.map(async column => {
                if (column.type == 'value') {
                    points.push({
                        'id': {
                            'row': row.id,
                            'type': 'value',
                            'column': column.id
                        },
                        'type': 'value',
                        'group': this.date.group,
                        'inputId': column.inputId,
                        'deviceId': column.deviceId,
                        'expression': column.expression
                    });
                } else if (column.type == 'chart') {
                    column.series.map(series => {
                        points.push({
                            'id': {
                                'row': row.id,
                                'type': 'array',
                                'column': column.id,
                                'series': series.id
                            },
                            'type': 'array',
                            'group': this.date.group,
                            'inputId': series.inputId,
                            'deviceId': series.deviceId
                        });
                    });
                };
                column.conditions.map(condition => {
                    points.push({
                        'id': {
                            'row': row.id,
                            'type': 'condition',
                            'column': column.id,
                            'condition': condition.id
                        },
                        'type': 'value',
                        'group': this.date.group,
                        'inputId': condition.inputId,
                        'deviceId': condition.deviceId,
                        'expression': 'last-value'
                    });
                });
            });
        });
        
        const response = await this.service.load({
            'date': {
                'to': this.date.to,
                'from': this.date.from
            },
            'points': points
        });

        if (response.ok) {
            response.result.map(item => {
                this.report.layout[this.layout].map(row => {
                    if (row.id == item.id.row) {
                        row.columns.map(column => {
                            if (column.id == item.id.column && item.id.type == 'value' && typeof(item.result) != 'undefined' && item.result !== null) {
                                if (item.type == 'analog') {
                                    column.value = [item.result.toFixed(item.analog.decimals || 0), '<small>', item.analog.units, '</small>'].join('');
                                } else if (item.type == 'digital') {
                                    if (item.result == 0) {
                                        column.value = item.digital.low;
                                    } else if (item.result == 1) {
                                        column.value = item.digital.high;
                                    } else {
                                        column.value = '❗';
                                    };
                                } else {
                                    column.value = '❗';
                                };
                            } else if (column.id == item.id.column && item.id.type == 'array' && typeof(item.result) != 'undefined' && item.result !== null) {
                                column.series.map(series => {
                                    if (series.id == item.id.series) {
                                        series.data = item.result;
                                    };
                                });
                            } else if (column.id == item.id.column && item.id.type == 'condition' && typeof(item.result) != 'undefined' && item.result !== null) {
                                column.restore();
                                column.conditions.map(condition => {
                                    if (condition.id == item.id.condition) {
                                        if (item.type == 'analog' && item.result >= condition.analog.min && item.result <= condition.analog.max) {
                                            column.fill = condition.fill;
                                            column.font = condition.font;
                                            column.stroke = condition.stroke;
                                            column.banner = condition.banner;
                                        } else if (item.type == 'digital' && item.result == condition.digital.value) {
                                            column.fill = condition.fill;
                                            column.font = condition.font;
                                            column.stroke = condition.stroke;
                                            column.banner = condition.banner;
                                        } else {
                                            column.restore();
                                        };
                                    };
                                });
                            };
                        });
                    };
                });
            });
        } else {
            this.toast.error(response.error.message);
        };

        this.loading = false;
    };

    public async reload(column, group) {
        this.loading = true;
        
        let points = [];

        if (column.type == 'value') {
            points.push({
                'id': {
                    'type': 'value',
                    'column': column.id
                },
                'type': 'value',
                'group': group,
                'inputId': column.inputId,
                'deviceId': column.deviceId,
                'expression': column.expression
            });
        } else if (column.type == 'chart') {
            column.series.map(series => {
                points.push({
                    'id': {
                        'type': 'array',
                        'column': column.id,
                        'series': series.id
                    },
                    'type': 'array',
                    'group': group,
                    'inputId': series.inputId,
                    'deviceId': series.deviceId
                });
            });
        };
        column.conditions.map(condition => {
            points.push({
                'id': {
                    'type': 'condition',
                    'column': column.id,
                    'condition': condition.id
                },
                'type': 'value',
                'group': group,
                'inputId': condition.inputId,
                'deviceId': condition.deviceId,
                'expression': 'last-value'
            });
        });

        const response = await this.service.load({
            'date': {
                'to': this.date.to,
                'from': this.date.from
            },
            'points': points
        });

        if (response.ok) {
            response.result.map(item => {
                if (item.id.type == 'value' && typeof(item.result) != 'undefined' && item.result !== null) {
                    if (item.type == 'analog') {
                        column.value = [item.result.toFixed(item.analog.decimals || 0), '<small>', item.analog.units, '</small>'].join('');
                    } else if (item.type == 'digital') {
                        if (item.result == 0) {
                            column.value = item.digital.low;
                        } else if (item.result == 1) {
                            column.value = item.digital.high;
                        } else {
                            column.value = '❗';
                        };
                    } else {
                        column.value = '❗';
                    };
                } else if (item.id.type == 'array' && typeof(item.result) != 'undefined' && item.result !== null) {
                    column.series.map(series => {
                        if (series.id == item.id.series) {
                            series.data = item.result;
                        };
                    });
                } else if (item.id.type == 'condition' && typeof(item.result) != 'undefined' && item.result !== null) {
                    column.restore();
                    column.conditions.map(condition => {
                        if (condition.id == item.id.condition) {
                            if (item.type == 'analog' && item.result >= condition.analog.min && item.result <= condition.analog.max) {
                                column.fill = condition.fill;
                                column.font = condition.font;
                                column.stroke = condition.stroke;
                                column.banner = condition.banner;
                            } else if (item.type == 'digital' && item.result == condition.digital.value) {
                                column.fill = condition.fill;
                                column.font = condition.font;
                                column.stroke = condition.stroke;
                                column.banner = condition.banner;
                            } else {
                                column.restore();
                            };
                        };
                    });
                };
            });
        } else {
            this.toast.error(response.error.message);
        };

        this.loading = false;
    };

    ngOnInit(): void {
        this.set();

        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.date = new DateGroup(data);
            this.date.process();
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