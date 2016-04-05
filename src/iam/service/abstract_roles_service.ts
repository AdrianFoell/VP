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

import {log, logger, isBlank, isEmpty} from '../../shared/shared';

abstract class AbstractRolesService {
    abstract findAllRoles(): Array<string>;

    @log
    getNormalizedRoles(roles: Array<string>): Array<string> {
        if (isBlank(roles) || roles.length === 0) {
            logger.debug('isBlank(roles)');
            return null;
        }

        const normalizedRoles: Array<string> = [];
        roles.forEach(r => {
            const normalizedRole: string = this._getNormalizedRole(r);
            if (normalizedRole !== null) {
                normalizedRoles.push(normalizedRole);
            }
        });
        return normalizedRoles.length === 0 ? null : normalizedRoles;
    }

    toString(): string { return 'AbstractRolesService'; }

    @log
    private _getNormalizedRole(role: string): string {
        if (isEmpty(role)) {
            return null;
        }

        // Falls der Rollenname in Grossbuchstaben geschrieben ist, wird er
        // trotzdem gefunden
        const normalizedRole: string = this.findAllRoles().find(
            (r: string) => r.toLowerCase() === role.toLowerCase());
        return isEmpty(normalizedRole) ? null : normalizedRole;
    }
}

export default AbstractRolesService;
