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
import {isUUID} from 'validator';

import {log, logger, isMongoId} from './shared';

class SharedRequestHandler {
    @log
    logRequestHeader(req: Request, res: Response, next: NextFunction): void {
        logger.debug(
            `Request: headers=${JSON.stringify(req.headers, null, 2)}`);
        logger.debug(
            `Request: protocol=${JSON.stringify(req.protocol, null, 2)}`);
        logger.debug(
            `Request: hostname=${JSON.stringify(req.hostname, null, 2)}`);
        if (req.body !== undefined) {
            logger.debug(`Request: body=${JSON.stringify(req.body, null, 2)}`);
        }
        Object.keys(req).forEach((key: any) => {
            if (req.hasOwnProperty(key)) {
                logger.log('silly', `Request-Key: ${key}`);
            }
        });

        // Request-Verarbeitung fortsetzen
        next();
    }

    @log
    validateMongoId(req: Request, res: Response, next: NextFunction, id: any):
        void {
        logger.debug(`id = ${id}`);

        if (!isMongoId(id)) {
            logger.debug('status = 400');
            res.status(400).send(`${id} ist keine gueltige Buch-ID`);
        }

        next();
    }

    @log
    validateUUID(req: Request, res: Response, next: NextFunction, id: any):
        void {
        if (!isUUID(id)) {
            logger.debug('status = 400');
            res.status(400).send(`${id} ist keine gueltige Buch-ID`);
            return;
        }

        next();
    }

    @log
    notYetImplemented(req: Request, res: Response): void {
        res.sendStatus(501);
    }

    toString(): string { return 'SharedRequestHandler'; }
}

// -----------------------------------------------------------------------
// E x p o r t i e r t e   F u n c t i o n s
// -----------------------------------------------------------------------
export function logRequestHeader(
    req: Request, res: Response, next: NextFunction): void {
    'use strict';
    new SharedRequestHandler().logRequestHeader(req, res, next);
}

export function validateMongoId(
    req: Request, res: Response, next: NextFunction, id: any): void {
    'use strict';
    new SharedRequestHandler().validateMongoId(req, res, next, id);
}

export function validateUUID(
    req: Request, res: Response, next: NextFunction, id: any): void {
    'use strict';
    new SharedRequestHandler().validateUUID(req, res, next, id);
}

export function notYetImplemented(req: Request, res: Response): void {
    'use strict';
    new SharedRequestHandler().notYetImplemented(req, res);
}
