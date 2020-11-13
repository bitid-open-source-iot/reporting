/* --- PAGES --- */
import { ReportEditorPage } from './editor.page';

/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { BloxModule } from 'src/app/lib/blox/blox.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormFieldModule } from 'src/app/lib/form-field/form-field.module';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* --- COMPONENTS --- */
import { ColumnSetupComponent } from './setup/setup.component';
import { ColumnStyleComponent } from './style/style.component';
import { ColumnConditionsComponent } from './conditions/conditions.component';

const routes: Routes = [
    {
        'path': '',
        'component': ReportEditorPage
    }
];

@NgModule({
    imports: [
        BloxModule,
        FormsModule,
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatTabsModule,
        MatTableModule,
        MatInputModule,
        DragDropModule,
        FormFieldModule,
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
        MatProgressSpinnerModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        ReportEditorPage,
        ColumnSetupComponent,
        ColumnStyleComponent,
        ColumnConditionsComponent
    ]
})

export class ReportEditorModule { }