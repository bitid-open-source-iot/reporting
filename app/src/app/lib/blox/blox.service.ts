import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class BloxService {

    constructor() { };

    public end: Subject<MouseEvent|TouchEvent> = new Subject<MouseEvent|TouchEvent>();
    public move: Subject<MouseEvent|TouchEvent> = new Subject<MouseEvent|TouchEvent>();
    public start: Subject<MouseEvent|TouchEvent> = new Subject<MouseEvent|TouchEvent>();
    public changes: Subject<any> = new Subject<any>();
    public editing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public selected: BehaviorSubject<Selected> = new BehaviorSubject<Selected>(null);
    public resizing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

}

export interface Selected {
    'id': string;
    'type': string;
}