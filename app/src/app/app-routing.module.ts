/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* --- SERVICES --- */
import { AuthManager } from './services/account/account.manager';

const routes: Routes = [
    {
        'path':         'signin',
        'loadChildren': () => import('./pages/signin/signin.module').then(m => m.SigninModule)
    },
    {
        'path':         'signup',
        'loadChildren': () => import('./pages/signup/signup.module').then(m => m.SignupModule)
    },
    {
        'path':         'reports',
        'canActivate':  [AuthManager],
        'loadChildren': () => import('./pages/reports/reports.module').then(m => m.ReportsModule)
    },
    {
        'path':         'verify-account',
        'loadChildren': () => import('./pages/verify-account/verify-account.module').then(m => m.VerifyAccountModule)
    },
    {
        'path':         'privacy-policy',
        'loadChildren': () => import('./pages/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule)
    },
    {
        'path':         'terms-and-conditions',
        'loadChildren': () => import('./pages/terms-and-conditions/terms-and-conditions.module').then(m => m.TermsAndConditionsModule)
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

export class AppRoutingModule { }