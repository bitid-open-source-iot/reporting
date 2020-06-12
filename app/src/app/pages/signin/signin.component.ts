import { MenuService } from 'src/app/services/menu/menu.service';
import { AuthService } from './../../services/auth/auth.service';
import { BrandingService } from '@bitid/branding';
import { TranslateService } from '@bitid/translate';
import { FormErrorService } from './../../services/form-error/form-error.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OnInit, Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector:     'app-signin',
    styleUrls:    ['./signin.component.scss'],
    templateUrl:  './signin.component.html'
})

export class SigninComponent implements OnInit, OnDestroy {

    constructor(public menu: MenuService, private translate: TranslateService, private branding: BrandingService, private service: AuthService, private router: Router, private route: ActivatedRoute, private formerror: FormErrorService) {};

    public form:    FormGroup  = new FormGroup({
        'email':    new FormControl('', [Validators.required, Validators.email]),
        'password': new FormControl('', [Validators.required])
    });
    public brand:           any = {};
    public params:          any;
    public errors:          any = {
        'email':    '',
        'password': ''
    };
    public loading:         boolean;
    public language:        string  = this.translate.language.value;
    private subscriptions:  any     = {};

    public async submit() {
        this.loading = true;

        this.form.disable();

        const response = await this.service.login({
            'email':    this.form.value.email,
            'password': this.form.value.password
        });

        this.form.enable();
      
        this.loading = false;

        if (response.ok) {
            if (typeof(this.params) != "undefined") {
                if (typeof(this.params.replaceUrl) != "undefined") {
                    this.router.navigate([this.params.replaceUrl]);
                } else {
                    this.router.navigate(['/reports']);
                };
            } else {
                this.router.navigate(['/reports']);
            };
            // this.toast.success("Sign in was successful!", "WELCOME");
        } else {
            let message: string;
            if (response.error.type == "authenticate") {
                if (response.error.code == "69" || response.error.code == "70" || response.error.code == "71") { 
                    message = "The email you are using is either not registered or you haven't varified the account!"
                } else if (response.error.code == "401") { 
                    message = "Invalid email or password!"
                };
                // this.toast.error(message);
            } else if (response.error.type == "allowaccess") { 
                // this.toast.error("Something went wrong allowing you access, try again!");
            };
        };
    };

    ngOnInit() {
        this.menu.close();

        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });
        
        this.subscriptions.route = this.route.queryParams.subscribe(params => {
            this.params = params;
        });

		this.subscriptions.language = this.translate.language.subscribe(language => {
			this.language = language;
		});

        this.subscriptions.branding = this.branding.branding.subscribe(brand => {
            this.brand = brand;
        });
    };

    ngOnDestroy() {
        this.subscriptions.form.unsubscribe();
        this.subscriptions.route.unsubscribe();
        this.subscriptions.language.unsubscribe();
        this.subscriptions.branding.unsubscribe();
    };
}