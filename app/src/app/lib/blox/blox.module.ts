/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

/* --- SERVICES --- */
import { BloxService } from './blox.service';

/* --- COMPONENTS --- */
import { BloxComponent } from './blox.component';
import { BloxRowComponent } from './row/row.component';
import { BloxColumnComponent } from './column/column.component';

@NgModule({
    imports: [
        CommonModule,
        DragDropModule
    ],
    exports: [
        BloxComponent,
        BloxRowComponent,
        BloxColumnComponent
    ],
    providers: [
        BloxService
    ],
    declarations: [
        BloxComponent,
        BloxRowComponent,
        BloxColumnComponent
    ]
})

export class BloxModule { }