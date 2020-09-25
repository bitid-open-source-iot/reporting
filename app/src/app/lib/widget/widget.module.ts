/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* --- COMPONENTS --- */
import { WidgetComponent } from './widget.component';
import { WidgetChartComponent } from './chart/chart.component';
import { WidgetValueComponent } from './value/value.component';
import { WidgetBannerComponent } from './banner/banner.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        WidgetComponent,
        WidgetChartComponent,
        WidgetValueComponent,
        WidgetBannerComponent
    ],
    declarations: [
        WidgetComponent,
        WidgetChartComponent,
        WidgetValueComponent,
        WidgetBannerComponent
    ]
})

export class WidgetModule { }