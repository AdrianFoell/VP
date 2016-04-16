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

import AbstractRolesService from './abstract_roles_service';
import RolesServiceDb from './db/roles_service_db';
import RolesServiceFile from './file/roles_service_file';
import {ROLES_USERS, log} from '../../shared/shared';

export default class RolesService extends AbstractRolesService {
    private _impl: AbstractRolesService;

    constructor() {
        super();
        switch (ROLES_USERS) {
            case 'db':
                this._impl = new RolesServiceDb();
                break;
            case 'files':
                this._impl = new RolesServiceFile();
                break;
            default:
                throw new Error('Es ist nur "db" und "file" verfuegbar');
        }
    }

    @log
    findAllRoles(): Array<string> { return this._impl.findAllRoles(); }

    toString(): string { return 'RolesService'; }
}
