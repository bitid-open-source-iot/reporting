import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from './../../../environments/environment';

@Injectable({
	providedIn: 'root'
})

export class ReportsService {

	constructor(private api: ApiService) {};

	public async add(params) {
		return await this.api.post(environment.reporting, '/reporting/reports/add', params);
	};

	public async get(params) {
		return await this.api.post(environment.reporting, '/reporting/reports/get', params);
	};

	public async list(params) {
		return  await this.api.post(environment.reporting, '/reporting/reports/list', params);
	};

	public async share(params) {
		return  await this.api.post(environment.reporting, '/reporting/reports/share', params);
	};

	public async update(params) {
		return  await this.api.post(environment.reporting, '/reporting/reports/update', params);
	};

	public async delete(params) {
		return  await this.api.post(environment.reporting, '/reporting/reports/delete', params);
	};

	public async unsubscribe(params) {
		return  await this.api.post(environment.reporting, '/reporting/reports/unsubscribe', params);
	};

	public async updatesubscriber(params) {
		return  await this.api.post(environment.reporting, '/reporting/reports/updatesubscriber', params);
	};
}

export interface Report {
	'url': 			string;
	'type': 		string;
	'users': 		any[];
	'role'?: 		string;
	'reportId': 	string;
	'description': 	string;
}

export const REPORT_DEFAULTS = {
	'url': 			null,
	'role': 		null,
	'type': 		null,
	'users': 		[],
	'reportId': 	null,
	'description': 	null
}