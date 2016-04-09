/*
 * Copyright (C) 2015 - 2016 Juergen Zimmermann, Hochschule Karlsruhe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Abfrage, ob ein Objekt weder <code>null</code> noch <code>undefined</code>
 * ist.
 */
export function isPresent(obj: any): boolean {
    'use strict';
    return obj !== undefined && obj !== null;
}

/**
 * Abfrage, ob ein Objekt <code>null</code> oder <code>undefined</code> ist.
 */
export function isBlank(obj: any): boolean {
    'use strict';
    return obj === undefined || obj === null;
}

/**
 * Abfrage, ob ein String leer oder <code>null</code> oder
 * <code>undefined</code> ist.
 */
export function isEmpty(obj: string): boolean {
    'use strict';
    return obj === undefined || obj === null || obj === '';
}

/**
 * Abfrage, ob ein Objekt ein String ist.
 */
export function isString(obj: any): boolean {
    'use strict';
    return typeof obj === 'string';
}

/**
 * Ein Benutzernamen und ein Passwort werden zu einem String zusammengefasst und
 * dabei durch einen Doppelpunkt (:) getrennt. Dieser String wird
 * anschlie&szlig;end mit Base64 codiert. Das Ergebnis kann dann f&uuml;
 * BASIC-Authentifizierung verwendet werden.
 * @param username Der Benutzername
 * @param password Das Passwort
 * @return Der mit Base64 codierte String.
 */
export function toBase64(username: string, password: string): string {
    'use strict';
    /* tslint:disable:max-line-length */
    // http://stackoverflow.com/questions/34177221/angular2-how-to-inject-window-into-an-angular2-service
    // https://gist.github.com/gdi2290/f8a524cdfb1f54f1a59c
    /* tslint:enable:max-line-length */
    return window.btoa(`${username}:${password}`);
}

// In AngularJS durch Pipes wie z.B. currency oder percent
// export function toEuro(value: number): string {
//     'use strict';
//     const options: any = {
//         minimumIntegerDigits: 1,
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//         style: 'currency',
//         currency: 'eur',
//         currencyDisplay: 'symbol'
//     };
//     return new Intl.NumberFormat('de', options).format(value);
// }
//
// export function toProzent(value: number): string {
//     'use strict';
//     const options: any = {
//         minimumIntegerDigits: 1,
//         minimumFractionDigits: 1,
//         maximumFractionDigits: 2,
//         style: 'percent'
//     };
//     return new Intl.NumberFormat('de', options).format(value);
// }
