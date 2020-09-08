/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* --- COMPONENTS --- */
import { ImageComponent } from './image/image';
import { TitleComponent } from './title/title';
import { CaptionComponent } from './caption/caption';
import { MessageComponent } from './message';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        ImageComponent,
        TitleComponent,
        CaptionComponent,
        MessageComponent
    ],
    declarations: [
        ImageComponent,
        TitleComponent,
        CaptionComponent,
        MessageComponent
    ]
})

export class MessageModule {}