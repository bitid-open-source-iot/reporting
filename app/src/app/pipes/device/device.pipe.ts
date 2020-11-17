import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'device',
    pure: false
})

export class DevicePipe implements PipeTransform {

    transform(devices: any[], deviceId: string, other?: string): string {
        for (let i = 0; i < devices.length; i++) {
            if (devices[i].deviceId == deviceId) {
                return devices[i].description;
            };
        };
        return other || '';
    };

}