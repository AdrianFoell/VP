/*
 * Copyright (C) 2016 Juergen Zimmermann, Hochschule Karlsruhe
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
"use strict";
const util_1 = require('util');
const logger_1 = require('./logger');
const util_2 = require('./util');
// In Anlehnung an:
// http://html5hive.org/getting-started-with-angular-2#crayon-560cd5f774dd7156114609
/**
 * Decorator zur Protokollierung einer Methode (NICHT: Funktion):
 * <ul>
 *  <li> Methodenaufruf:&nbsp;&nbsp;&nbsp; &gt;
 *       <i>Klassenname</i>.<i>Methodenname</i>; zzgl. aktuelle Argumente
 *  <li> Methodenende:&nbsp;&nbsp;&nbsp; &lt;
 *       <i>Klassenname</i>.<i>Methodenname</i> zzgl. R&uuml;ckgabewert
 * </ul>
 */
function log(target /* Function */, key, descriptor) {
    'use strict';
    const originalMethod = descriptor.value;
    // keine Arrow Function wg. this im Funktionsrumpf
    // Spread-Parameter ab ES 2015
    descriptor.value = function (...args) {
        const klasseAsString = target.toString();
        // indexOf: Zaehlung ab 0. -1 bedeutet nicht enthalten
        // bei Klassen mit toString() werden ggf. Attributwerte nach einem ":""
        // ausgegeben
        const positionColon = klasseAsString.indexOf(':');
        const klassenname = positionColon === -1 ?
            klasseAsString :
            klasseAsString.substring(0, positionColon);
        if (args.length === 0) {
            logger_1.logger.debug(`> ${klassenname}.${key}()`);
        }
        else {
            // Gibt es Request- oder Response-Objekte von Express?
            if (containsRequestResponse(args)) {
                logger_1.logger.debug(`> ${klassenname}.${key}(): args = <RequestResponse>`);
            }
            else {
                try {
                    logger_1.logger.debug(`> ${klassenname}.${key}(): args = ${JSON.stringify(args)}`);
                }
                catch (TypeError) {
                    // TypeError bei stringify wegen einer zykl. Datenstruktur
                    // const obj = {a: "foo", b: obj};
                    // https://nodejs.org/api/util.html
                    logger_1.logger.debug(`> ${klassenname}.${key}(): args = ${util_1.inspect(args)}`);
                }
            }
        }
        const result = originalMethod.apply(this, args);
        let resultStr;
        if (result === undefined) {
            resultStr = 'void || undefined';
        }
        else if (isPromise(result)) {
            resultStr = '<Promise>';
        }
        else {
            resultStr = JSON.stringify(result);
        }
        logger_1.logger.debug(`< ${klassenname}.${key}(): result = ${resultStr}`);
        return result;
    };
    return descriptor;
}
exports.log = log;
function containsRequestResponse(args) {
    'use strict';
    return args.filter((arg) => util_2.isPresent(arg))
        .find((arg) => isRequest(arg) || isResponse(arg))
        !== undefined;
}
function isRequest(arg) {
    'use strict';
    return arg.method !== undefined && arg.httpVersion !== undefined;
}
function isResponse(arg) {
    'use strict';
    return arg.statusCode !== undefined;
}
function isPromise(result) {
    'use strict';
    return util_2.isPresent(result) && result.model !== undefined
        && result.schema !== undefined;
}
