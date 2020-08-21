/* --- PAGES --- */
import { SigninComponent } from './pages/signin/signin.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ReportViewerComponent } from './pages/reports/viewer/viewer.component';
import { ReportEditorComponent } from './pages/reports/editor/editor.component';

/* --- MODULES --- */
import {
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatRippleModule,
    MatTooltipModule,
    MatToolbarModule,
    MatSidenavModule,
    MatBottomSheetModule,
    MatProgressBarModule,
    MatSnackBarModule,
} from '@angular/material';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { NgModule } from '@angular/core';
import { OrderModule } from 'ngx-order-pipe';
import { BrowserModule } from '@angular/platform-browser';
import { BrandingModule } from '@bitid/branding';
import { TranslateModule } from '@bitid/translate';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* --- SERVICES --- */
import { ApiService } from './services/api/api.service';
import { MenuService } from './services/menu/menu.service';
import { AuthManager } from './services/auth/auth.manager';
import { AuthService } from './services/auth/auth.service';
import { HistoryService } from './services/history/history.service';
import { ReportsService } from './services/reports/reports.service';
import { FormErrorService } from './services/form-error/form-error.service';
import { LocalstorageService } from './services/localstorage/localstorage.service';

/* --- COMPONENTS --- */
import { AppComponent } from './app.component';
import { ShareComponent } from './components/share/share.component';
import { RemoveComponent } from './components/remove/remove.component';
import { SubscribersComponent } from './components/subscribers/subscribers.component';
import { UnsubscribeComponent } from './components/unsubscribe/unsubscribe.component';
import { OptionsSheetComponent } from './components/options-sheet/options-sheet.component';
import { ToastService } from './services/toast/toast.service';
import { AccountService } from './services/account/account.service';

@NgModule({
    declarations: [
        AppComponent,
        ShareComponent,
        RemoveComponent,
        SigninComponent,
        ReportsComponent,
        SubscribersComponent,
        UnsubscribeComponent,
        OptionsSheetComponent,
        ReportViewerComponent,
        ReportEditorComponent
    ],
    imports: [
        FormsModule,
        OrderModule,
        BrowserModule,
        MatIconModule,
        MatListModule,
        MatTableModule,
        BrandingModule,
        MatInputModule,
        MatRippleModule,
        MatSelectModule,
        MatButtonModule,
        MatDialogModule,
        TranslateModule,
        MatTooltipModule,
        MatToolbarModule,
        AppRoutingModule,
        MatSidenavModule,
        HttpClientModule,
        FilterPipeModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatBottomSheetModule,
        MatProgressBarModule,
        BrowserAnimationsModule
    ],
    providers: [
        ApiService,
        MenuService,
        AuthManager,
        AuthService,
        ToastService,
        AccountService,
        HistoryService,
        ReportsService,
        FormErrorService,
        LocalstorageService
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        ShareComponent,
        RemoveComponent,
        SubscribersComponent,
        UnsubscribeComponent,
        OptionsSheetComponent
    ]
})

export class AppModule {}