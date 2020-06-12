/* --- PAGES --- */
import { SigninComponent } from './pages/signin/signin.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ReportViewerComponent } from './pages/reports/viewer/viewer.component';
import { ReportEditorComponent } from './pages/reports/editor/editor.component';

/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* --- SERVICES --- */
import { AuthManager } from './services/auth/auth.manager';

const routes: Routes = [
    {
        'path':         'signin',
        'component':    SigninComponent
    },
    {
        'path':         'reports',
        'component':    ReportsComponent,
        'canActivate':  [AuthManager]
    },
    {
        'path':         'reports/:mode',
        'component':    ReportEditorComponent,
        'canActivate':  [AuthManager]
    },
    {
        'path':         'reports/view/:reportId',
        'component':    ReportViewerComponent,
        'canActivate':  [AuthManager]
    },
    {
        'path':         'reports/:mode/:reportId',
        'component':    ReportEditorComponent,
        'canActivate':  [AuthManager]
    },
    {
        'path':         '**',
        'redirectTo':   'reports'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}