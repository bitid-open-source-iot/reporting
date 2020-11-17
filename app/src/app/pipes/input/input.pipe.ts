import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'input',
    pure: false
})

export class InputPipe implements PipeTransform {

    transform(devices: any[], deviceId: string, inputId: string, other?: string): string {
        for (let a = 0; a < devices.length; a++) {
            if (devices[a].deviceId == deviceId) {
                for (let b = 0; b < devices[a].inputs.length; b++) {
                    if (devices[a].inputs[b].inputId == inputId) {
                        return devices[a].inputs[b].description;
                    };
                };
            };
        };
        return other || '';
    };

}