import { Connector } from 'src/app/interfaces/connector';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ConnectorsService {

    public data: Connector[] = [];

    constructor(private api: ApiService) { };

    public async get(params: any) {
        return await this.api.post(environment.reporting, '/reporting/connectors/get', params);
    };

    public async list(params: any) {
        return await this.api.post(environment.reporting, '/reporting/connectors/list', params);
    };

}