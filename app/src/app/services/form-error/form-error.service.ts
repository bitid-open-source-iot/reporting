import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class FormErrorService {

    private messages() {
        return {
            'email': 'This email address is invalid',
            'required': 'This field is required',
            'not_allowed_characters': (matches: any[]) => {
                let matchedCharacters = matches;

                matchedCharacters = matchedCharacters.reduce((characterString, character, index) => {
                    let string = characterString;
                    string += character;

                    if (matchedCharacters.length !== index + 1) {
                        string += ', ';
                    }

                    return string;
                }, '');

                return `These characters are not allowed: ${matchedCharacters}`;
            },
        };
    };

    private errors(group: FormGroup, errors: any, dirty?: boolean) {
        const form = group;

        Object.keys(errors).map(field => {
            if (typeof(errors[field]) == "string") {
                if (field) {
                    errors[field] = '';
                    const control = form.get(field);

                    const messages = this.messages();
                    if (control && !control.valid) {
                        if (!dirty || (control.dirty || control.touched)) {
                            for (const key in control.errors) {
                                if (key && key !== 'not_allowed_characters') {
                                    errors[field] = errors[field] || messages[key];
                                } else {
                                    errors[field] = errors[field] || messages[key](control.errors[key]);
                                };
                            };
                        };
                    };
                };
            } else if (typeof(errors[field]) == "object") {
                const inner: any = form.get(field);
                errors[field] = this.errors(inner, errors[field], dirty);
            };
        });

        return errors;
    };

    public validateForm(formToValidate: FormGroup, errors: any, checkDirty?: boolean) {
        return this.errors(formToValidate, errors, checkDirty);
    };
}