import { BloxBanner, BLOXBANNER, BloxFill, BLOXFILL, BloxFont, BLOXFONT, BloxStroke, BLOXSTROKE } from '@bitid/blox';
import { User } from '../interfaces/user';

export class Report {

    public role?: number = 0;
    public users?: User[] = [];
    public layout?: REPORTLAYOUT = new ReportLayout();
    public settings?: REPORTSETTINGS = new ReportSettings();
    public reportId?: string;
    public description?: string = '';
    
    constructor(report?: REPORT) {
        if (typeof(report) != 'undefined' && report !== null) {
            if (typeof(report.role) != 'undefined' && report.role !== null) {
                this.role = report.role;
            };
            if (typeof(report.users) != 'undefined' && report.users !== null) {
                this.users = report.users;
            };
            if (typeof(report.layout) != 'undefined' && report.layout !== null) {
                this.layout = new ReportLayout(report.layout);
            };
            if (typeof(report.settings) != 'undefined' && report.settings !== null) {
                this.settings = new ReportSettings(report.settings);
            };
            if (typeof(report.reportId) != 'undefined' && report.reportId !== null) {
                this.reportId = report.reportId;
            };
            if (typeof(report.description) != 'undefined' && report.description !== null) {
                this.description = report.description;
            };
        };
    };

}

export interface REPORT {
    'role'?: number;
    'users'?: User[];
    'layout'?: REPORTLAYOUT;
    'settings'?: REPORTSETTINGS;
    'reportId'?: string;
    'description'?: string;
}

export class ReportLayout {

    public mobile?: any[] = [];
    public tablet?: any[] = [];
    public desktop?: any[] = [];
    
    constructor(layout?: REPORTLAYOUT) {
        if (typeof(layout) != 'undefined' && layout !== null) {
            if (Array.isArray(layout.mobile)) {
                this.mobile = layout.mobile;
            };
            if (Array.isArray(layout.tablet)) {
                this.tablet = layout.tablet;
            };
            if (Array.isArray(layout.desktop)) {
                this.desktop = layout.desktop;
            };
        };
    };

}

export interface REPORTLAYOUT {
    'mobile'?: any[];
    'tablet'?: any[];
    'desktop'?: any[];
}

export class ReportSettings {

    public fill?: BLOXFILL = new BloxFill();
    public font?: BLOXFONT = new BloxFont();
    public board?: BLOXFILL = new BloxFill();
    public stroke?: BLOXSTROKE = new BloxStroke();
    public banner?: BLOXBANNER = new BloxBanner();
    
    constructor(settings?: REPORTSETTINGS) {
        if (typeof(settings) != 'undefined' && settings !== null) {
            if (typeof(settings.fill) != 'undefined' && settings.fill !== null) {
                this.fill = new BloxFill(settings.fill);
            };
            if (typeof(settings.font) != 'undefined' && settings.font !== null) {
                this.font = new BloxFont(settings.font);
            };
            if (typeof(settings.board) != 'undefined' && settings.board !== null) {
                this.board = new BloxFill(settings.board);
            };
            if (typeof(settings.stroke) != 'undefined' && settings.stroke !== null) {
                this.stroke = new BloxStroke(settings.stroke);
            };
            if (typeof(settings.banner) != 'undefined' && settings.banner !== null) {
                this.banner = new BloxBanner(settings.banner);
            };
        };
    };

}

export interface REPORTSETTINGS {
    'fill'?: BLOXFILL;
    'font'?: BLOXFONT;
    'board'?: BLOXFILL;
    'stroke'?: BLOXSTROKE;
    'banner'?: BLOXBANNER;
}