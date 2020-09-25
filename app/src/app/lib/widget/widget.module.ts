/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* --- COMPONENTS --- */
import { WidgetComponent } from './widget.component';
import { WidgetValueComponent } from './value/value.component';
import { WidgetBannerComponent } from './banner/banner.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        WidgetComponent,
        WidgetValueComponent,
        WidgetBannerComponent
    ],
    declarations: [
        WidgetComponent,
        WidgetValueComponent,
        WidgetBannerComponent
    ]
})

export class WidgetModule { }