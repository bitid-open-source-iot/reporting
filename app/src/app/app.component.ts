import { Title, } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { AuthService } from './services/auth/auth.service';
import { MenuService } from './services/menu/menu.service';
import { BrandingService } from '@bitid/branding';
import { TranslateService } from '@bitid/translate';
import { OnInit, ViewChild, Component } from '@angular/core';

@Component({
	selector: 		'app-root',
	styleUrls: 		['./app.component.scss'],
	templateUrl: 	'./app.component.html'
})

export class AppComponent implements OnInit {

	constructor(public menu: MenuService, private auth: AuthService, private title: Title, private router: Router, private branding: BrandingService, private translate: TranslateService) {
		this.translate.directory = './assets/translate/';
	};

	public mode: 		string;
	public brand: 		any 	= {};
	public loaded: 		boolean = false;
	public licenced: 	boolean = false;
	public language: 	string	= this.translate.language.value;

	@ViewChild('sidemenu', {'static': true}) private sidemenu: MatSidenav;

	public logout() {
    	this.menu.close();
		this.auth.logout();
		this.router.navigate(['/signin']);
	};

    ngOnInit() {
		this.translate.language.subscribe(language => {
			this.language = language;
		});

        this.branding.branding.subscribe(brand => {
			if (brand.name) {
				this.brand = brand;
				let favicon: any = document.getElementById('favicon');
					favicon.href = this.brand.icon;
				this.title.setTitle(this.brand.name);
			};
		});

		this.branding.licenced.subscribe((licenced: boolean) => {
			this.licenced = licenced;
		});

        this.menu.change.subscribe((mode: string) => {
        	this.mode = mode;
        });
        
        this.menu.init(this.sidemenu);
    };
}