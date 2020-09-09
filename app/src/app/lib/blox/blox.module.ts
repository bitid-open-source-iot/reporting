/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* --- COMPONENTS --- */
import { BloxComponent } from './blox.component';
import { BloxRowComponent } from './row/row.component';
import { BloxColumnComponent } from './column/column.component';
import { BloxColumnLabelComponent } from './column-label/column-label.component';
import { BloxColumnContentComponent } from './column-content/column-content.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        BloxComponent,
        BloxRowComponent,
        BloxColumnComponent,
        BloxColumnLabelComponent,
        BloxColumnContentComponent
    ],
    declarations: [
        BloxComponent,
        BloxRowComponent,
        BloxColumnComponent,
        BloxColumnLabelComponent,
        BloxColumnContentComponent
    ]
})

export class BloxModule { }