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

import AbstractIamService from './abstract_iam_service';
import IamServiceJwt from './jwt/iam_service_jwt';
import IamServiceBasicAuth from './basic_auth/iam_service_basic_auth';
import {log, AUTH_METHOD} from '../../shared/shared';

export default class IamService extends AbstractIamService {
    private _impl: AbstractIamService;

    constructor() {
        super();
        switch (AUTH_METHOD) {
            case 'jwt':
                this._impl = new IamServiceJwt();
                break;

            case 'basic-auth':
                this._impl = new IamServiceBasicAuth();
                break;

            default:
                throw new Error(
                    'Es ist nur "JWT" und "Basic Authentication" verfuegbar');
        }
    }

    @log
    login(req: Request): any { return this._impl.login(req); }

    @log
    validateJwt(req: Request): number { return this._impl.validateJwt(req); }

    @log
    isLoggedIn(req: Request): boolean { return this._impl.isLoggedIn(req); }

    @log
    hasAnyRole(req: Request, roles: Array<string>): boolean {
        return this._impl.hasAnyRole(req, roles);
    }

    toString(): string { return 'IamService'; }
}
