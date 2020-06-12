import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { LocalstorageService } from './../localstorage/localstorage.service';

@Injectable({
    providedIn: 'root'
})

export class MenuService {

    constructor(private localstorage: LocalstorageService) {};

    public menu:   MatSidenav;
    public mode:   number = 0;
    public change: Subject<string> = new Subject();

    public init(menu) {
        let mode     = this.localstorage.get('menu_mode');
        
        this.menu     = menu;

        this.change.next('small');

        if (typeof(mode) == "undefined" || mode == null) {
            this.mode = 0;
            this.toggle();
        } else {
            this.mode = parseInt(mode);
            this.toggle();
        };
    };

    public close() {
        this.change.next('small');
        this.menu.close();
        this.mode = 0;
        this.localstorage.set('menu_mode', this.mode);
    };

    public toggle() {
        this.localstorage.set('menu_mode', this.mode);
        switch(this.mode) {
            case(0):
                this.change.next('small');
                if (!this.menu.opened) { 
                    this.menu.open();
                };
                this.mode++;
                break;
           case(1):
                this.change.next('large');
                if (!this.menu.opened) { 
                    this.menu.open();
                };
                this.mode++;
                break;
           case(2):
                this.change.next('small');
                this.menu.close();
                this.mode = 0;
                break;
        };
    };

    public changeRoute() {
        if (this.mode > 1) { 
            this.toggle();
        };
    };
}