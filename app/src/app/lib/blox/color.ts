export function color(hex: string, opacity: number) {
    if (typeof(hex) == 'undefined' || hex === null || hex === '') {
        return null;
    } else {
        if (typeof(opacity) == 'undefined' || opacity === null) {
            opacity = 1;
        };
        let color = hex.substring(1).match(/.{1,2}/g);
        return ['rgba(', [parseInt(color[0], 16), parseInt(color[1], 16), parseInt(color[2], 16), opacity].join(', '), ')'].join('');
    };
}