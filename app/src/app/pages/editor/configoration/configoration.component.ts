import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit, Component, OnDestroy, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'configoration',
    styleUrls: ['./configoration.component.scss'],
    templateUrl: './configoration.component.html',
    encapsulation: ViewEncapsulation.None
})

export class ConfigorationComponent implements OnInit, OnDestroy {

    constructor(private el: ElementRef, private formerror: FormErrorService) {
        this.element = this.el.nativeElement;
    };

    public form: FormGroup = new FormGroup({
        'fill': new FormGroup({
            'color': new FormControl('#000000', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)])
        }),
        'font': new FormGroup({
            'size': new FormControl(24, [Validators.required]),
            'color': new FormControl('#FFFFFF', [Validators.required]),
            'family': new FormControl('Arial', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)]),
            'vertical': new FormControl('center', [Validators.required]),
            'horizontal': new FormControl('center', [Validators.required])
        }),
        'stroke': new FormGroup({
            'width': new FormControl(0, [Validators.required, Validators.min(0), Validators.max(20)]),
            'style': new FormControl('solid', [Validators.required]),
            'color': new FormControl('#000000', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)])
        }),
        'banner': new FormGroup({
            'size': new FormControl(12, [Validators.required, Validators.min(0), Validators.max(24)]),
            'color': new FormControl('#FFFFFF', [Validators.required]),
            'family': new FormControl('Arial', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)]),
            'vertical': new FormControl('top', [Validators.required]),
            'horizontal': new FormControl('left', [Validators.required])
        }),
        'chartfill': new FormGroup({
            'color': new FormControl('#FFFFFF', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)])
        }),
        'gridlines': new FormGroup({
            'width': new FormControl(1, [Validators.required, Validators.min(0), Validators.max(5)]),
            'style': new FormControl('solid', [Validators.required]),
            'color': new FormControl('#E0E0E0', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)])
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
        },
        'chartfill': {
            'color': '',
            'opacity': ''
        },
        'gridlines': {
            'width': '',
            'style': '',
            'color': '',
            'opacity': ''
        }
    };
    public change: EventEmitter<any> = new EventEmitter<any>();
    public element: HTMLElement;
    private subscriptions: any = {};

    ngOnInit(): void {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
            if (!this.form.invalid) {
                this.change.next(data);
            };
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
    };

}