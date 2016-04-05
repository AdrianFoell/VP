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
const mongodb_1 = require('mongodb');
const validator_1 = require('validator');
const util_1 = require('./util');
const logger_1 = require('./logger');
// ObjectId ist ein 12-Byte String (bzw. HEX-String mit 24 Zeichen):
//  4-Byte: Sekunden seit 1.1.1970
//  3-Byte: Host-ID
//  2-Byte: Prozess-ID
//  3-Byte: Zaehler mit Zufallszahl als Startwert
// https://docs.mongodb.org/manual/reference/object-id
function isMongoId(id) {
    'use strict';
    if (util_1.isBlank(id)) {
        return false;
    }
    return !util_1.isEmpty(id) && id.length === 24 && validator_1.isHexadecimal(id);
}
exports.isMongoId = isMongoId;
function generateMongoId() {
    'use strict';
    const id = new mongodb_1.ObjectID();
    logger_1.logger.debug(`id = ${JSON.stringify(id)}`);
    return id;
}
exports.generateMongoId = generateMongoId;
