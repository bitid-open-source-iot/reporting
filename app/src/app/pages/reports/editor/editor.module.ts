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
import { MatDialogModule } from '@angular/material/dialog';
import { InputPipeModule } from 'src/app/pipes/input/input.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FilterPipeModule } from 'src/app/pipes/filter/filter.module';
import { MatContentModule } from 'src/app/lib/mat-content/mat-content.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DevicePipeModule } from 'src/app/pipes/device/device.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Routes, RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* --- COMPONENTS --- */
import { TextForm } from './setup/text-form/text-form.component';
import { ValueForm } from './setup/value-form/value-form.component';
import { ChartForm } from './setup/chart-form/chart-form.component';
import { VectorForm } from './setup/vector-form/vector-form.component';
import { ThemeDialog } from './theme/theme.dialog';
import { AddRowDialog } from './add-row/add-row.dialog';
import { SeriesEditorDialog } from './setup/chart-form/editor/editor.dialog';
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
        MatDialogModule,
        MatFooterModule,
        MatRippleModule,
        MatSelectModule,
        OrderPipeModule,
        InputPipeModule,
        MatTooltipModule,
        MatContentModule,
        MatToolbarModule,
        MatSidenavModule,
        FilterPipeModule,
        DevicePipeModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        MatProgressSpinnerModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        TextForm,
        ChartForm,
        ValueForm,
        VectorForm,
        ThemeDialog,
        AddRowDialog,
        ReportEditorPage,
        SeriesEditorDialog,
        ColumnSetupComponent,
        ColumnStyleComponent,
        ColumnConditionsComponent
    ]
})

export class ReportEditorModule { }