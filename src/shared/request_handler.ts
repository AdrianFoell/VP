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
    /* tslint:disable:max-line-length */
    addSecurityHeader(req: Request, res: Response, next: NextFunction): void {
        // HSTS = HTTP Strict Transport Security
        // https://www.owasp.org/index.php/HTTP_Strict_Transport_Security
        res.setHeader(
            'Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        // CORS = Cross Origin Resource Sharing
        // http://www.html5rocks.com/en/tutorials/cors
        res.setHeader('Access-Control-Allow-Origin', 'https://localhost');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader(
            'Access-Control-Allow-Methods',
            'OPTIONS, GET, POST, PUT, DELETE, HEAD');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'origin, content-type, accept, authorization, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers, allow, content-length, date, last-modified, if-modified-since');
        res.setHeader('Access-Control-Max-Age', '1728000');

        // CSP = Content Security Policy
        // http://www.html5rocks.com/en/tutorials/security/content-security-policy
        res.setHeader(
            'Content-Security-Policy',
            'default-src https:; script-src https: \'self\'; img-src https: \'self\'; media-src https: \'self\'');

        // XSS = Cross Site Scripting
        // https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
        res.setHeader('X-XSS-Protection', '1; mode=block');

        // Clickjacking
        // http://tools.ietf.org/html/draft-ietf-websec-x-frame-options-01
        // https://www.owasp.org/index.php/Clickjacking
        res.setHeader('X-Frame-Options', 'deny');

        // MIME-sniffing
        // https://blogs.msdn.microsoft.com/ie/2008/09/02/ie8-security-part-vi-beta-2-update
        res.setHeader('X-Content-Type-Options', 'nosniff');

        res.setHeader(
            'Cache-Control',
            'private,no-cache,no-store,max-age=0,no-transform');
        res.setHeader('Expires', '-1');
        res.setHeader('Pragma', 'no-cache');

        res.setHeader('X-Provided-By', 'Juergen Zimmermann');

        // Request-Verarbeitung fortsetzen
        next();
    }
    /* tslint:enable:max-line-length */

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

export function addSecurityHeader(
    req: Request, res: Response, next: NextFunction): void {
    'use strict';
    new SharedRequestHandler().addSecurityHeader(req, res, next);
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
