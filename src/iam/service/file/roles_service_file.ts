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

// https://nodejs.org/api/fs.html
// https://github.com/nodejs/node/blob/master/lib/buffer.js#L191
// Einzulesende oder zu schreibende Dateien im Format UTF-8
import {readFileSync} from 'fs';

import AbstractRolesService from '../abstract_roles_service';
import {log} from '../../../shared/shared';

export default class RolesServiceFile extends AbstractRolesService {
    private static _ROLES: Array<string> =
        JSON.parse(readFileSync('iam/service/file/roles.json', 'utf-8'));

    @log
    findAllRoles(): Array<string> { return RolesServiceFile._ROLES; }

    toString(): string { return 'RolesServiceFile'; }
}
