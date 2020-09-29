/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

/* --- SERVICES --- */
import { BloxService } from './blox.service';

/* --- COMPONENTS --- */
import { BloxComponent } from './blox.component';
import { BloxRowComponent } from './row/row.component';
import { BloxFilterComponent } from './filter/filter.component';
import { BloxColumnComponent } from './column/column.component';
import { BloxColumnTextComponent } from './column/text/text.component';
import { BloxColumnErrorComponent } from './column/error/error.component';
import { BloxColumnChartComponent } from './column/chart/chart.component';
import { BloxColumnValueComponent } from './column/value/value.component';
import { BloxColumnImageComponent } from './column/image/image.component';
import { BloxColumnBannerComponent } from './column/banner/banner.component';

@NgModule({
    imports: [
        CommonModule,
        DragDropModule
    ],
    exports: [
        BloxComponent,
        BloxRowComponent,
        BloxColumnComponent,
        BloxFilterComponent,
        BloxColumnTextComponent,
        BloxColumnErrorComponent,
        BloxColumnChartComponent,
        BloxColumnValueComponent,
        BloxColumnImageComponent,
        BloxColumnBannerComponent
    ],
    providers: [
        BloxService
    ],
    declarations: [
        BloxComponent,
        BloxRowComponent,
        BloxColumnComponent,
        BloxFilterComponent,
        BloxColumnTextComponent,
        BloxColumnErrorComponent,
        BloxColumnChartComponent,
        BloxColumnValueComponent,
        BloxColumnImageComponent,
        BloxColumnBannerComponent
    ]
})

export class BloxModule { }