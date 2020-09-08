import { Input, Output, Component, Renderer2, OnChanges, ElementRef, EventEmitter } from '@angular/core';

@Component({
    selector: 'row',
    styleUrls: ['./row.component.scss'],
    templateUrl: './row.component.html'
})

export class BloxRowComponent implements OnChanges {
    
    @Input('width') public width: number = 100;
    @Input('height') public height: number = 0;
    @Input('background') public background: string;

    @Output('changes') private changes: EventEmitter<any> = new EventEmitter<any>();
    
    constructor(private element: ElementRef, private renderer: Renderer2) {
        this.renderer.setStyle(this.element.nativeElement, 'height', this.height + 'px');
        this.renderer.setStyle(this.element.nativeElement, 'background', this.background);
        this.renderer.setStyle(this.element.nativeElement, 'flex', '0 calc(' + this.width + '% - 10px)');
    };

    ngOnChanges(): void {
        this.renderer.setStyle(this.element.nativeElement, 'height', this.height + 'px');
        this.renderer.setStyle(this.element.nativeElement, 'background', this.background);
        this.renderer.setStyle(this.element.nativeElement, 'flex', '0 calc(' + this.width + '% - 10px)');
    };

}