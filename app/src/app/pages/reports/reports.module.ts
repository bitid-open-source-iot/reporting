/* --- PAGES --- */
import { ReportsPage } from './reports.page';
import { ThemeDialog } from './editor/theme/theme.dialog';
import { AddRowDialog } from './editor/add-row/add-row.dialog';
import { ConditionDialog } from './editor/column/condition/condition.dialog';
import { ReportViewerPage } from './viewer/viewer.page';
import { ReportEditorPage } from './editor/editor.page';
import { CustomDatesDialog } from './viewer/custom-dates/custom-dates.dialog';
import { ColumnEditorDialog } from './editor/column/column.dialog';

/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { BloxModule } from 'src/app/lib/blox/blox.module';
import { ShareModule } from 'src/app/components/share/share.module';
import { DeleteModule } from 'src/app/components/delete/delete.module';
import { CommonModule } from '@angular/common';
import { SearchModule } from 'src/app/components/search/search.module';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { OrderPipeModule } from 'src/app/pipes/order/order.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FilterPipeModule } from 'src/app/pipes/filter/filter.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UnsubscribeModule } from 'src/app/components/unsubscribe/unsubscribe.module';
import { SubscribersModule } from 'src/app/components/subscribers/subscribers.module';
import { BottomSheetModule } from 'src/app/components/bottom-sheet/bottom-sheet.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReportsRoutingModule } from './reports-routing.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        BloxModule,
        FormsModule,
        ShareModule,
        CommonModule,
        DeleteModule,
        SearchModule,
        MatIconModule,
        MatMenuModule,
        MatListModule,
        DragDropModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatRippleModule,
        MatButtonModule,
        OrderPipeModule,
        MatTooltipModule,
        MatToolbarModule,
        FilterPipeModule,
        BottomSheetModule,
        UnsubscribeModule,
        SubscribersModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        ReportsRoutingModule,
        MatBottomSheetModule,
        MatProgressBarModule,
        MatAutocompleteModule,
        MatButtonToggleModule,
        MatProgressSpinnerModule
    ],
    declarations: [
        ThemeDialog,
        ReportsPage,
        AddRowDialog,
        ConditionDialog,
        ReportViewerPage,
        ReportEditorPage,
        CustomDatesDialog,
        ColumnEditorDialog
    ]
})

export class ReportsModule {}