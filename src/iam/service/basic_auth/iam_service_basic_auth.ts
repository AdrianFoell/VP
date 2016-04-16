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

// Alternativen zu Basic Authentication
// JWT (= JSON Web Token)
// OAuth2
// Cookies: Sicherheitsprobleme mit CSRF und CORS

import {Request} from 'express';
import {BasicAuthResult} from 'basic-auth';
import * as basicAuth from 'basic-auth';

import AbstractIamService from '../abstract_iam_service';
import RolesService from '../roles_service';
import UsersService from '../users_service';
import {log, logger, isBlank} from '../../../shared/shared';

export default class IamServiceBasicAuth extends AbstractIamService {
    private _rolesService: RolesService = new RolesService();
    private _usersService: UsersService = new UsersService();

    @log
    login(req: Request): Array<string> {
        const credentials: BasicAuthResult = basicAuth(req);
        if (isBlank(credentials)) {
            logger.debug('isBlank(credentials)');
            return null;
        }

        const username: string = credentials.name;
        logger.debug(`username = ${credentials.name}`);
        const user: any = this._usersService.findByUsername(username);

        const password: string = credentials.pass;
        logger.debug(`password = ${credentials.pass}`);

        if (!this.checkPassword(user, password)) {
            return null;
        }
        return user.roles;
    }

    @log
    isLoggedIn(req: Request): boolean {
        const credentials: BasicAuthResult = basicAuth(req);
        if (isBlank(credentials)) {
            logger.debug('isBlank(credentials)');
            return false;
        }

        const username: string = credentials.name;
        logger.debug(`username = ${credentials.name}`);
        const user: any = this._usersService.findByUsername(username);

        const password: string = credentials.pass;
        logger.debug(`password = ${credentials.pass}`);

        return this.checkPassword(user, password);
    }

    @log
    hasAnyRole(req: Request, roles: Array<string>): boolean {
        const credentials: BasicAuthResult = basicAuth(req);
        if (isBlank(credentials)) {
            logger.debug('isBlank(credentials)');
            return false;
        }
        const username: string = credentials.name;
        logger.debug(`username = ${credentials.name}`);
        const user: any = this._usersService.findByUsername(username);

        roles = this._rolesService.getNormalizedRoles(roles);
        return super.userHasAnyRole(user, roles);
    }

    toString(): string { return 'IamServiceBasicAuth'; }
}
