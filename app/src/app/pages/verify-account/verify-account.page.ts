import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AccountService } from 'src/app/services/account/account.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { OnInit, Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector:       'app-verify-account-page',
    styleUrls:      ['./verify-account.page.scss'],
    templateUrl:    './verify-account.page.html'
})

export class VerifyAccountPage implements OnInit, OnDestroy {

    constructor(private toast: ToastService, private router: Router, private service: AccountService, private formerror: FormErrorService) {};

    public form:            FormGroup   = new FormGroup({
        'code':     new FormControl('', [Validators.required, Validators.min(100000), Validators.max(999999), Validators.minLength(6), Validators.maxLength(6)]),
        'email':    new FormControl('', [Validators.email, Validators.required])
    });
    public errors:          any         = {
        'code':     '',
        'email':    ''
    };
    public loading:         boolean;
    private subscriptions:  any         = {};

    public async submit() {
        this.loading = true;

        this.form.disable();

        const response = await this.service.verify({
            'code':     this.form.value.code,
            'email':    this.form.value.email
        });

        this.form.enable();

        this.loading = false;

        if (response.ok) {
            this.router.navigate(['/signin'], {
                'replaceUrl': true
            });
        } else {
            this.toast.error(response.error.message);
        };
    };

    ngOnInit(): void {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
    };

}