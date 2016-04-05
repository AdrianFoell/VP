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

import {Request, Response, NextFunction} from 'express';

import IamService from '../service/iam_service';
import {log, logger, isBlank} from '../../shared/shared';

class IamRequestHandler {
    private _iamService: IamService = new IamService();

    @log
    login(req: Request, res: Response): void {
        const rollen: Array<String> = this._iamService.login(req);
        if (isBlank(rollen)) {
            logger.debug('401');
            res.sendStatus(401);
            return;
        }

        res.json(rollen);
    }

    @log
    validateJwt(req: Request, res: Response, next: NextFunction): void {
        if (!this._iamService.validateJwt(req)) {
            logger.debug('401');
            res.sendStatus(401);
            return;
        }
        next();
    }

    @log
    isLoggedIn(req: Request, res: Response, next: NextFunction): void {
        if (!this._iamService.isLoggedIn(req)) {
            logger.debug('401');
            res.sendStatus(401);
            return;
        }

        // Verarbeitung fortsetzen
        next();
    }

    @log
    isAdmin(req: Request, res: Response, next: NextFunction): void {
        if (!this._hasRolle(req, res, 'admin')) {
            return;
        }

        // Verarbeitung fortsetzen
        next();
    }

    @log
    isAdminMitarbeiter(req: Request, res: Response, next: NextFunction): void {
        if (!this._hasRolle(req, res, 'admin', 'mitarbeiter')) {
            return;
        }

        // Verarbeitung fortsetzen
        next();
    }

    toString(): string { return 'IamRequestHandler'; }

    @log
    private _hasRolle(req: Request, res: Response, ...roles: Array<string>):
        boolean {
        logger.debug(`Rollen = ${JSON.stringify(roles)}`);

        if (!this._iamService.isLoggedIn(req)) {
            logger.debug('401');
            res.sendStatus(401);
            return false;
        }

        if (!this._iamService.hasAnyRole(req, roles)) {
            logger.debug('403');
            res.sendStatus(403);
            return false;
        }

        return true;
    }
}

// -----------------------------------------------------------------------
// E x p o r t i e r t e   F u n c t i o n s
// -----------------------------------------------------------------------
export function login(req: Request, res: Response, next: NextFunction): void {
    'use strict';
    new IamRequestHandler().login(req, res);
}

export function validateJwt(
    req: Request, res: Response, next: NextFunction): void {
    'use strict';
    new IamRequestHandler().validateJwt(req, res, next);
}

export function isLoggedIn(
    req: Request, res: Response, next: NextFunction): void {
    'use strict';
    new IamRequestHandler().isLoggedIn(req, res, next);
}

export function isAdmin(req: Request, res: Response, next: NextFunction): void {
    'use strict';
    new IamRequestHandler().isAdmin(req, res, next);
}

export function isAdminMitarbeiter(
    req: Request, res: Response, next: NextFunction): void {
    'use strict';
    new IamRequestHandler().isAdminMitarbeiter(req, res, next);
}
