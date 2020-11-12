/* --- PAGES --- */
import { ReportEditorPage } from './editor.page';

/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { OrderPipeModule } from 'src/app/pipes/order/order.module';
import { MatFooterModule } from 'src/app/lib/mat-footer/mat-footer.module';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FilterPipeModule } from 'src/app/pipes/filter/filter.module';
import { MatContentModule } from 'src/app/lib/mat-content/mat-content.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Routes, RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* --- COMPONENTS --- */
import { ConditionsComponent } from './conditions/conditions.component';
import { ConfigorationComponent } from './configoration/configoration.component';

const routes: Routes = [
    {
        'path': '',
        'component': ReportEditorPage
    }
];

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatTableModule,
        MatInputModule,
        MatButtonModule,
        MatFooterModule,
        MatRippleModule,
        MatSelectModule,
        OrderPipeModule,
        MatContentModule,
        MatToolbarModule,
        MatSidenavModule,
        FilterPipeModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        ReportEditorPage,
        ConditionsComponent,
        ConfigorationComponent
    ]
})

export class ReportEditorModule { }