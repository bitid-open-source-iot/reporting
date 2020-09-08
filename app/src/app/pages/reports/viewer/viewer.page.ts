import { Report } from 'src/app/interfaces/report';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from 'src/app/services/history/history.service';
import { OnInit, Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-report-viewer-page',
    styleUrls: ['./viewer.page.scss'],
    templateUrl: './viewer.page.html'
})

export class ReportViewerPage implements OnInit, OnDestroy {

    constructor(private route: ActivatedRoute, private toast: ToastService, public history: HistoryService, private service: ReportsService) { };

    public rows: any[] = [];
    public report: Report;
    public loading: boolean;
    public reportId: string;
    private subscriptions: any = {};

    private async get() {
        this.loading = true;

        const response = await this.service.get({
            'filter': [
                'role',
                'reporId',
                'description'
            ],
            'reportId': this.reportId
        });

        if (response.ok) {
            this.report = response.result;
        } else {
            this.toast.error(response.error.message);
            this.history.back();
        };

        this.loading = false;
    };

    public async download() {};

    ngOnInit(): void {
        this.subscriptions.route = this.route.queryParams.subscribe(params => {
            this.reportId = params.reportId;
            this.get();
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.route.unsubscribe();
    };

}