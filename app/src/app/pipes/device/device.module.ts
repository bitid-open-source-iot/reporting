import { NgModule } from '@angular/core';
import { DevicePipe } from './device.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        DevicePipe
    ],
    declarations: [
        DevicePipe
    ],
    entryComponents: [
        DevicePipe
    ]
})

export class DevicePipeModule {}