import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LocalstorageService }  from '../localstorage/localstorage.service';

@Injectable()

export class AuthService {

    constructor(private api: ApiService, private router: Router, private localstorage: LocalstorageService) {};

    public authenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public async login(params) {
        const authenticate = await this.authenticate({
            'email':    params.email,
            'password': params.password
        });

        if (!authenticate.ok)  {
            this.authenticated.next(false);
            authenticate.error.type = "authenticate";
            return authenticate;
        };

        const allowaccess = await this.allowaccess();

        if (allowaccess.ok)  {
            this.authenticated.next(true);
            return allowaccess;
        } else {
            this.authenticated.next(false);
            allowaccess.error.type = "allowaccess";
            return allowaccess;
        };
    };

    public logout() {
        this.localstorage.clear();
        this.router.navigate(['/login']);
        this.authenticated.next(false);
    };

    public async verify(params) {
        params.email        = params.email;
        params.appId     = environment.appId;
        params.description  = environment.appName;
       
        this.localstorage.set('email', params.email);

        return await this.api.put(environment.auth, '/auth/verify', params);
    };

    public async GetUser() {
        const response = await this.api.post(environment.auth, '/users/get', {});

        if (response.ok) {
            if (typeof(response.result.profilePic) != "undefined") {
                response.result.picture = response.result.profilePic;
               delete response.result.profilePic;
            };
        };
        
        return response;
    };

    public async register(params) {
        params.appId    = environment.appId;
        params.description = environment.appName;

        this.localstorage.set('email', params.email);

        return await this.api.put(environment.auth, '/auth/register', params);
    };

    private async allowaccess() {
        let expiry = new Date();
        expiry.setDate(expiry.getDate() + 1000);
        
        const response = await this.api.post(environment.auth, '/auth/allowaccess', {
            'expiry':       expiry,
            'scopes':       environment.scopes,
            'appId':     environment.appId,
            'tokenAddOn':   {},
            'description':  environment.appName
        });

        if (response.ok) {
            this.localstorage.setObject('token', response.result[0].token);
        };
        
        return response;
    };
    
    private async authenticate(params) {
        params.appId    = environment.appId;
        params.description = environment.appName;

        this.localstorage.set('email', params.email);

        const response = await this.api.put(environment.auth, '/auth/authenticate', params);

        if (response.ok) {
            this.localstorage.setObject('token', response.result[0].token);
        };

        return response;
    };

    public async resetpassword(params) {
        params.appId    = environment.appId;
        params.description = environment.appName;

        this.localstorage.set('email', params.email);

        return await this.api.put(environment.auth, '/auth/resetpassword', params);
    };
}
