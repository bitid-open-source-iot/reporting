/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* --- COMPONENTS --- */
import { BloxComponent } from './blox.component';
import { BloxRowComponent } from './row/row.component';
import { BloxColumnComponent } from './column/column.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        BloxComponent,
        BloxRowComponent,
        BloxColumnComponent
    ],
    declarations: [
        BloxComponent,
        BloxRowComponent,
        BloxColumnComponent
    ]
})

export class BloxModule { }