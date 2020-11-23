import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit, Component, OnDestroy, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'column-style',
    styleUrls: ['./style.component.scss'],
    templateUrl: './style.component.html',
    encapsulation: ViewEncapsulation.None
})

export class ColumnStyleComponent implements OnInit, OnDestroy {

    constructor(private el: ElementRef, private formerror: FormErrorService) {
        this.element = this.el.nativeElement;
    };

    public form: FormGroup = new FormGroup({
        'fill': new FormGroup({
            'color': new FormControl('#000000', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)])
        }),
        'font': new FormGroup({
            'size': new FormControl(24, [Validators.required, Validators.min(24), Validators.max(48)]),
            'color': new FormControl('#FFFFFF', [Validators.required]),
            'family': new FormControl('Arial', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)]),
            'vertical': new FormControl('center', [Validators.required]),
            'horizontal': new FormControl('center', [Validators.required])
        }),
        'stroke': new FormGroup({
            'width': new FormControl(0, [Validators.required, Validators.min(0), Validators.max(5)]),
            'style': new FormControl('solid', [Validators.required]),
            'color': new FormControl('#000000', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)])
        }),
        'banner': new FormGroup({
            'size': new FormControl(12, [Validators.required, Validators.min(8), Validators.max(24)]),
            'color': new FormControl('#FFFFFF', [Validators.required]),
            'family': new FormControl('Arial', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)]),
            'vertical': new FormControl('top', [Validators.required]),
            'horizontal': new FormControl('left', [Validators.required])
        })
    });
    public errors: any = {
        'fill': {
            'color': '',
            'opacity': ''
        },
        'font': {
            'size': '',
            'color': '',
            'family': '',
            'opacity': '',
            'vertical': '',
            'horizontal': ''
        },
        'stroke': {
            'width': '',
            'style': '',
            'color': '',
            'opacity': ''
        },
        'banner': {
            'size': '',
            'color': '',
            'family': '',
            'opacity': '',
            'vertical': '',
            'horizontal': ''
        }
    };
    public update: EventEmitter<any> = new EventEmitter<any>();
    public change: EventEmitter<any> = new EventEmitter<any>();
    public element: HTMLElement;
    public setting: boolean;
    private subscriptions: any = {};

    public blur() {
        this.update.next(this.form.value);
    };

    public async reset() {
        this.form.setValue({
            'fill': {
                'color': '#000000',
                'opacity': 100
            },
            'font': {
                'size': 24,
                'color': '#FFFFFF',
                'family': 'Arial',
                'opacity': 100,
                'vertical': 'center',
                'horizontal': 'center'
            },
            'stroke': {
                'width': 0,
                'style': 'solid',
                'color': '#000000',
                'opacity': 100
            },
            'banner': {
                'size': 12,
                'color': '#FFFFFF',
                'family': 'Arial',
                'opacity': 100,
                'vertical': 'top',
                'horizontal': 'left'
            }
        });
        this.form.markAsUntouched();
    };

    public async set(data) {
        this.setting = true;
        Object.keys(this.form.controls).map(key => {
            this.form.controls[key].setValue(data[key]);
        });
        this.setting = false;
    };

    ngOnInit(): void {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
            if (!this.setting) {
                this.change.next(data);
            };
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
    };

}