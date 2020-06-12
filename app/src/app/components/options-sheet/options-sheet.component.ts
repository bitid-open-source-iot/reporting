import { TranslateService } from '@bitid/translate';
import { Inject, OnInit, Component, OnDestroy } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
    selector:       'app-options-sheet',
    styleUrls:      ['./options-sheet.component.scss'],
    templateUrl:    './options-sheet.component.html'
})

export class OptionsSheetComponent implements OnInit, OnDestroy {
    
    constructor(private sheet: MatBottomSheetRef<OptionsSheetComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private translate: TranslateService) {};

    public items:           any[]   = this.data.items;
    public language:        string  = this.translate.language.value;
    public description:     string  = this.data.description;
    private subscriptions:  any     = {};

    public select(item) {
        this.sheet.dismiss(item.option);
    };

    ngOnInit() {
		this.subscriptions.language = this.translate.language.subscribe(language => {
			this.language = language;
        });
    };

    ngOnDestroy() {
        this.subscriptions.language.unsubscribe()
    };
}