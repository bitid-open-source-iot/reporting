/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SplashscreenModule } from './splashscreen/splashscreen.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* --- SERVICES --- */
import { ApiService } from './services/api/api.service';
import { AuthManager } from './services/account/account.manager';
import { ToastService } from './services/toast/toast.service';
import { ReportsService } from './services/reports/reports.service';
import { AccountService } from './services/account/account.service';
import { HistoryService } from './services/history/history.service';
import { FormErrorService } from './services/form-error/form-error.service';
import { LocalstorageService } from './services/localstorage/localstorage.service';

/* --- COMPONENTS --- */
import { AppComponent } from './app.component';

/* --- ENVIRONMENTS --- */
import { environment } from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        MatIconModule,
        BrowserModule,
        MatButtonModule,
        AppRoutingModule,
        HttpClientModule,
        MatSnackBarModule,
        SplashscreenModule,
        BrowserAnimationsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            'enabled': environment.production
        })
    ],
    providers: [
        ApiService,
        AuthManager,
        ToastService,
        ReportsService,
        AccountService,
        HistoryService,
        FormErrorService,
        LocalstorageService
    ],
    bootstrap: [
        AppComponent
    ]
})

export class ReportingAppModule { }