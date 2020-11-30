export class DateGroup {

    public to: Date = new Date();;
    public from: Date = new Date();;
    public group: string;
    public format: string;

    constructor(date?) {
        if (typeof(date) != 'undefined' && date !== null) {
            this.to = new Date(date.to);
            this.from = new Date(date.from);
        };

        this.to.setHours(23);
        this.to.setMinutes(59);
        this.to.setSeconds(59);
        this.to.setMilliseconds(999);

        this.from.setHours(0);
        this.from.setMinutes(0);
        this.from.setSeconds(0);
        this.from.setMilliseconds(0);

        this.process();
    };

    public process = async () => {
        const gap = this.to.getTime() - this.from.getTime();
        const days = new Date(this.to.getFullYear(), this.to.getMonth() + 1, 0).getDate();
        if (gap > 0 && gap <= (60 * 60 * 1000)) { /* --- HOUR --- */
            this.group = 'minute';
            this.format = 'YYYY/MM/DD HH:mm';
        } else if (gap > (60 * 60 * 1000) && gap <= (24 * 60 * 60 * 1000)) { /* --- DAY --- */
            this.group = 'hour';
            this.format = 'YYYY/MM/DD HH:00';
        } else if (gap > (24 * 60 * 60 * 1000) && gap <= (days * 7 * 24 * 60 * 60 * 1000)) { /* --- MONTH --- */
            this.group = 'day';
            this.format = 'YYYY/MM/DD';
        } else if (gap > (days * 7 * 24 * 60 * 60 * 1000) && gap <= (365 * 7 * 24 * 60 * 60 * 1000)) { /* --- YEAR --- */
            this.group = 'month';
            this.format = 'YYYY/MM';
        } else { /* --- YEAR + --- */
            this.group = 'year';
            this.format = 'YYYY';
        };
        return this;
    };

}