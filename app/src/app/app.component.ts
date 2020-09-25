import { DomSanitizer } from '@angular/platform-browser';
import { SplashScreen } from './splashscreen/splashscreen.component';
import { AccountService } from './services/account/account.service';
import { HistoryService } from './services/history/history.service';
import { MatIconRegistry } from '@angular/material/icon';
import { OnInit, Component, ViewChild } from '@angular/core';

@Component({
    selector: 'app-root',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

    @ViewChild(SplashScreen, { 'static': true }) private splashscreen: SplashScreen;

    constructor(private history: HistoryService, private account: AccountService, private registry: MatIconRegistry, private sanitizer: DomSanitizer) {
        this.registry.addSvgIcon('copy', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/copy.svg'));
        this.registry.addSvgIcon('data', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/data.svg'));
        this.registry.addSvgIcon('drag', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/drag.svg'));
        this.registry.addSvgIcon('edit', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/edit.svg'));
        this.registry.addSvgIcon('view', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/view.svg'));
        this.registry.addSvgIcon('share', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/share.svg'));
        this.registry.addSvgIcon('theme', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/theme.svg'));
        this.registry.addSvgIcon('mobile', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/mobile.svg'));
        this.registry.addSvgIcon('tablet', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/tablet.svg'));
        this.registry.addSvgIcon('delete', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/delete.svg'));
        this.registry.addSvgIcon('logout', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/logout.svg'));
        this.registry.addSvgIcon('desktop', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/desktop.svg'));
        this.registry.addSvgIcon('download', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/download.svg'));
        this.registry.addSvgIcon('percentage', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/percentage.svg'));
        this.registry.addSvgIcon('unsubscribe', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/unsubscribe.svg'));
        this.registry.addSvgIcon('subscribers', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/subscribers.svg'));
    };

    public authenticated: boolean;

    public async logout() {
        this.account.logout();
    };

    private async initialize() {
        await this.splashscreen.show();

        await this.history.init();
        await this.account.validate();

        await this.splashscreen.hide();
    };

    ngOnInit(): void {
        this.account.authenticated.subscribe(async authenticated => {
            this.authenticated = authenticated;
            if (authenticated) {
                this.account.load();
            };
        });

        this.initialize();
    };

}