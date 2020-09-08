/* --- PAGES --- */
import { ReportsPage } from './reports.page';
import { ReportViewerPage } from './viewer/viewer.page';
import { ReportEditorPage } from './editor/editor.page';

/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        'path': '',
        'component': ReportsPage
    },
    {
        'path': 'viewer',
        'component': ReportViewerPage
    },
    {
        'path': 'editor',
        'component': ReportEditorPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ReportsRoutingModule { }