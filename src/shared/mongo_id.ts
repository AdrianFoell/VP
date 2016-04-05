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

import {ObjectID} from 'mongodb';
import {isHexadecimal} from 'validator';

import {isBlank, isEmpty} from './util';
import {logger} from './logger';

// ObjectId ist ein 12-Byte String (bzw. HEX-String mit 24 Zeichen):
//  4-Byte: Sekunden seit 1.1.1970
//  3-Byte: Host-ID
//  2-Byte: Prozess-ID
//  3-Byte: Zaehler mit Zufallszahl als Startwert
// https://docs.mongodb.org/manual/reference/object-id

export function isMongoId(id: string): boolean {
    'use strict';
    if (isBlank(id)) {
        return false;
    }
    return !isEmpty(id) && id.length === 24 && isHexadecimal(id);
}

export function generateMongoId(): ObjectID {
    'use strict';
    const id: ObjectID = new ObjectID();
    logger.debug(`id = ${JSON.stringify(id)}`);
    return id;
}
