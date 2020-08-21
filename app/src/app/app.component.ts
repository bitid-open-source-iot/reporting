import { Title, } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { AuthService } from './services/auth/auth.service';
import { MenuService } from './services/menu/menu.service';
import { HistoryService } from './services/history/history.service';
import { TranslateService } from '@bitid/translate';
import { OnInit, ViewChild, Component } from '@angular/core';

@Component({
	selector: 		'app-root',
	styleUrls: 		['./app.component.scss'],
	templateUrl: 	'./app.component.html'
})

export class AppComponent implements OnInit {

	constructor(public menu: MenuService, private auth: AuthService, private history: HistoryService, private title: Title, private router: Router, private translate: TranslateService) {
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
		this.history.init();
		
        this.menu.change.subscribe((mode: string) => {
        	this.mode = mode;
        });
        
        this.menu.init(this.sidemenu);
    };
}