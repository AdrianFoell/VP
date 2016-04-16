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

import {Request} from 'express';
// node-forge als Alternative zu crypto-js enthaelt nicht SHA-3
// https://code.google.com/archive/p/crypto-js
import {SHA3, enc} from 'crypto-js';

import {log, TOKEN_OK, isBlank, logger} from '../../shared/shared';

abstract class AbstractIamService {
    abstract login(req: Request): any;
    abstract hasAnyRole(req: Request, roles: Array<string>): boolean;

    // JWT: ueberladen bzw. neu implementieren
    // Basic Authentifiizierung: irrelevant, d.h. kein ueberladen
    @log
    validateJwt(req: Request): number { return TOKEN_OK; }

    // JWT: bereits erledigt durch Validierung des Tokens
    // Basic Authentifiizierung: ueberladen bzw. neu implementieren
    @log
    isLoggedIn(req: Request): boolean { return true; }

    @log
    userHasAnyRole(user: any, roles: Array<string>): boolean {
        if (isBlank(user) || isBlank(roles) || roles.length === 0) {
            return false;
        }

        const userRoles: Array<string> = user.roles;
        let found: boolean = false;
        roles.forEach(role => {
            if (userRoles.find(userRole => userRole === role) !== undefined) {
                logger.debug(`Vorhandene Rolle: ${role}`);
                found = true;
            }
        });

        return found;
    }

    @log
    checkPassword(user: any, password: string): boolean {
        if (user === null) {
            logger.debug('Falscher Username');
            return false;
        }

        // Der Hashwert ist ein WordArray-Objekt mit Default-Laenge 512 Bit
        const hashWordArray: any = SHA3(password);
        const hashBase64: string = hashWordArray.toString(enc.Base64);
        return user.password === hashBase64;
    }

    toString(): string { return 'AbstractIamService'; }
}

export default AbstractIamService;
