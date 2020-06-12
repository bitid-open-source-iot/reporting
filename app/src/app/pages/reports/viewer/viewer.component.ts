import { MenuService } from 'src/app/services/menu/menu.service';
import { ActivatedRoute } from '@angular/router';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { TranslateService } from '@bitid/translate';
import { OnInit, OnDestroy, Component } from '@angular/core';

@Component({
    selector:       'app-report-viewer',
    styleUrls:      ['./viewer.component.scss'],
    templateUrl:    './viewer.component.html'
})

export class ReportViewerComponent implements OnInit, OnDestroy {

    constructor(public menu: MenuService, private route: ActivatedRoute, private service: ReportsService, private translate: TranslateService) {};

    public report:          any     = {};
    public loading:         boolean;
    public language:        string  = this.translate.language.value;
    private reportId:       string;
    private subscriptions:  any     = {};

    private async get() {
        this.loading = true;
        
        const response = await this.service.get({
            'reportId': this.reportId
        });

        this.loading = false;

        if (response.ok) {
            this.report = response.result;
            if (this.report.type == 'ds') {
                let dataStudioFrame: any      = document.getElementById('dataStudioFrame');
                dataStudioFrame.src           = this.report.url;
                dataStudioFrame.style.display = 'block';
            };
        } else {
            // show error
        };
    };

    public stopLoader(event) {
        this.loading = false;
    };

    ngOnInit() {
        this.subscriptions.route = this.route.params.subscribe(params => {
            this.reportId = params.reportId;
            this.get();
        });

        this.subscriptions.translate = this.translate.language.subscribe(language => {
            this.language = language;
        });
    };

    ngOnDestroy() {
        this.subscriptions.route.unsubscribe();
        this.subscriptions.translate.unsubscribe();
    };

}