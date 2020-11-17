import { NgModule } from '@angular/core';
import { InputPipe } from './input.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        InputPipe
    ],
    declarations: [
        InputPipe
    ],
    entryComponents: [
        InputPipe
    ]
})

export class InputPipeModule {}