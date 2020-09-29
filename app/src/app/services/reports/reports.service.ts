import { Theme } from 'src/app/interfaces/theme';
import { Report } from 'src/app/interfaces/report';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LocalstorageService } from '../localstorage/localstorage.service';

@Injectable({
    providedIn: 'root'
})

export class ReportsService {

    public data: Report[] = [];
    public theme: BehaviorSubject<Theme> = new BehaviorSubject<Theme>({
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
    });

    constructor(private api: ApiService, private localstorage: LocalstorageService) { };

    public async add(params: any) {
        const response = await this.api.post(environment.reporting, '/reporting/reports/add', params);

        if (response.ok) {
            let task: any = params;
            task.reportId = response.result.reportId;
            this.data.push(task);
        };

        return response;
    };

    public async get(params: any) {
        return await this.api.post(environment.reporting, '/reporting/reports/get', params);
    };

    public async list(params: any) {
        return await this.api.post(environment.reporting, '/reporting/reports/list', params);
    };

    public async load(params: any) {
        return await this.api.post(environment.reporting, '/reporting/reports/data', params);
    };

    public async share(params: any) {
        return await this.api.post(environment.reporting, '/reporting/reports/share', params);
    };

    public async update(params: any) {
        const response = await this.api.post(environment.reporting, '/reporting/reports/update', params);

        if (response.ok) {
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i].reportId == params.reportId) {
                    Object.keys(params).map(key => {
                        this.data[i][key] = params[key];
                    });
                    break;
                };
            };
        };

        return response;
    };

    public async delete(params: any) {
        const response = await this.api.post(environment.reporting, '/reporting/reports/delete', params);

        if (response.ok) {
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i].reportId == params.reportId) {
                    this.data.splice(i, 1);
                    break;
                };
            };
        };

        return response;
    };

    public async unsubscribe(params: any) {
        const response = await this.api.post(environment.reporting, '/reporting/reports/unsubscribe', params);

        if (response.ok) {
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i].reportId == params.reportId && params.email == this.localstorage.get('email')) {
                    this.data.splice(i, 1);
                    break;
                };
            };
        };

        return response;
    };

    public async updatesubscriber(params: any) {
        return await this.api.post(environment.reporting, '/reporting/reports/updatesubscriber', params);
    };

}