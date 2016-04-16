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

import IUsersService from './iusers_service';
import UsersServiceDb from './db/users_service_db';
import UsersServiceFile from './file/users_service_file';
import {ROLES_USERS, log} from '../../shared/shared';

export default class UsersService implements IUsersService {
    private _impl: IUsersService;

    constructor() {
        switch (ROLES_USERS) {
            case 'db':
                this._impl = new UsersServiceDb();
                break;
            case 'files':
                this._impl = new UsersServiceFile();
                break;
            default:
                throw new Error('Es ist nur "db" und "file" verfuegbar');
        }
    }

    @log
    findByUsername(username: string): any {
        return this._impl.findByUsername(username);
    }

    @log
    findByEmail(email: string): any { return this._impl.findByEmail(email); }

    toString(): string { return 'UsersService'; }
}
