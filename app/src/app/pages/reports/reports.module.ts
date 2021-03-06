/* --- PAGES --- */
import { ReportsPage } from './reports.page';
import { ReportViewerPage } from './viewer/viewer.page';
import { ReportEditorPage } from './editor/editor.page';

/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { BloxModule } from '@bitid/blox';
import { ShareModule } from 'src/app/components/share/share.module';
import { DeleteModule } from 'src/app/components/delete/delete.module';
import { CommonModule } from '@angular/common';
import { SearchModule } from 'src/app/components/search/search.module';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { OrderPipeModule } from 'src/app/pipes/order/order.module';
import { FormFieldModule } from 'src/app/lib/form-field/form-field.module';
import { MatFooterModule } from 'src/app/lib/mat-footer/mat-footer.module';
import { InputPipeModule } from 'src/app/pipes/input/input.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatContentModule } from 'src/app/lib/mat-content/mat-content.module';
import { DevicePipeModule } from 'src/app/pipes/device/device.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FilterPipeModule } from 'src/app/pipes/filter/filter.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UnsubscribeModule } from 'src/app/components/unsubscribe/unsubscribe.module';
import { SubscribersModule } from 'src/app/components/subscribers/subscribers.module';
import { BottomSheetModule } from 'src/app/components/bottom-sheet/bottom-sheet.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { Routes, RouterModule } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* --- COMPONENTS --- */
import { TextForm } from './editor/setup/text-form/text-form.component';
import { ValueForm } from './editor/setup/value-form/value-form.component';
import { ChartForm } from './editor/setup/chart-form/chart-form.component';
import { VectorForm } from './editor/setup/vector-form/vector-form.component';
import { AddRowDialog } from './editor/add-row/add-row.dialog';
import { SeriesEditorDialog } from './editor/setup/chart-form/editor/editor.dialog';
import { ConfirmUpdateDialog } from './editor/confirm/confirm.dialog';
import { ColumnSetupComponent } from './editor/setup/setup.component';
import { ColumnStyleComponent } from './editor/style/style.component';
import { ReportSettingsDialog } from './editor/settings/settings.dialog';
import { ConditionEditorDialog } from './editor/conditions/editor/editor.dialog';
import { ColumnConditionsComponent } from './editor/conditions/conditions.component';

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
    imports: [
        BloxModule,
        FormsModule,
        ShareModule,
        CommonModule,
        DeleteModule,
        SearchModule,
        MatMenuModule,
        MatTabsModule,
        MatIconModule,
        MatListModule,
        MatTableModule,
        DragDropModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatRippleModule,
        MatButtonModule,
        OrderPipeModule,
        FormFieldModule,
        MatFooterModule,
        InputPipeModule,
        MatTooltipModule,
        MatToolbarModule,
        FilterPipeModule,
        MatContentModule,
        MatSidenavModule,
        DevicePipeModule,
        BottomSheetModule,
        UnsubscribeModule,
        SubscribersModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatBottomSheetModule,
        MatProgressBarModule,
        MatAutocompleteModule,
        MatButtonToggleModule,
        NgxMatSelectSearchModule,
        MatProgressSpinnerModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        TextForm,
        ChartForm,
        ValueForm,
        VectorForm,
        ReportsPage,
        AddRowDialog,
        ReportViewerPage,
        ReportEditorPage,
        SeriesEditorDialog,
        ConfirmUpdateDialog,
        ColumnSetupComponent,
        ColumnStyleComponent,
        ReportSettingsDialog,
        ConditionEditorDialog,
        ColumnConditionsComponent
    ]
})

export class ReportsModule {}