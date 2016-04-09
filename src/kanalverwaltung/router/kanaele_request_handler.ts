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

import {Request, Response} from 'express';
import {Document as MDocument} from 'mongoose';

import KanaeleService from '../service/kanaele_service';
import {Kanal, validateKanal} from '../model/kanal';
import {getBaseUri, contentType, applicationJson, isBlank, log, logger} from '../../shared/shared';

class KanaeleRequestHandler {
    private _kanaeleService: KanaeleService = new KanaeleService();

    @log
    getById(req: Request, res: Response): void {
        const id: string = req.params.id;
        logger.debug(`id = ${id}`);

        this._kanaeleService
            // async. Aufruf AWK mit DB-Zugriff
            .findById(id)

            // Auswertung des async. Aufrufs
            .then((kanal: MDocument) => {
                if (isBlank(kanal)) {
                    logger.debug('status = 404');
                    res.sendStatus(404);
                    return;
                }

                const baseUri: string = getBaseUri(req);
                // Link Header
                res.links({
                    self: `${baseUri}/${id}`,
                    list: `${baseUri}`,
                    add: `${baseUri}`,
                    update: `${baseUri}`,
                    remove: `${baseUri}/${id}`
                });
                logger.debug(`getById(): kanal = ${JSON.stringify(kanal)}`);
                res.json(kanal);
            })
            .catch((err: any) => { res.sendStatus(500); });
    }

    @log
    getByQuery(req: Request, res: Response): void {
        // z.B. https://.../buecher?titel=Alpha
        const query: any = req.query;
        logger.debug(`queryParams = ${JSON.stringify(query)}`);

        this._kanaeleService
            // async. Aufruf fuer AWK mit DB-Zugriff
            .find(query)

            // Auswertung des async. Aufrufs
            .then((kanaele: Array<MDocument>) => {
                logger.debug(
                    `getByQuery(): buecher = ${JSON.stringify(kanaele)}`);

                if (kanaele.length === 0) {
                    // Alternative: https://www.npmjs.com/package/http-errors
                    // Damit wird aber auch der Stacktrace zum Client
                    // uebertragen, weil das resultierende Fehlerobjekt
                    // von Error abgeleitet ist.
                    logger.debug('status = 404');
                    res.sendStatus(404);
                    return;
                }

                // Link Header
                const baseUri: string = getBaseUri(req);
                const firstId: string = <string>kanaele[0]._id.valueOf();
                const lastId: string =
                    <string>kanaele[kanaele.length - 1]._id.valueOf();
                res.links({
                    self: `${baseUri}`,
                    list: `${baseUri}`,
                    first: `${baseUri}/${firstId}`,
                    last: `${baseUri}/${lastId}`
                });

                res.json(kanaele);
            })
            .catch((err: any) => { res.sendStatus(500); });
    }

    @log
    post(req: Request, res: Response): void {
        if (req.header(contentType) === undefined
            || req.header(contentType).toLowerCase() !== applicationJson) {
            logger.debug('status = 406');
            res.sendStatus(406);
            return;
        }

        const kanal: MDocument = new Kanal(req.body);
        logger.debug(`Body: ${JSON.stringify(kanal)}`);
        const err: any = validateKanal(kanal);
        if (err !== null) {
            logger.debug('status = 400');
            res.status(400).send(err);
            return;
        }

        this._kanaeleService
            // async. Aufruf fuer AWK mit DB-Zugriff
            .save(kanal)

            // Auswertung des async. Aufrufs
            .then((kanalSaved: MDocument) => {
                const id: string = <string>kanalSaved._id;
                logger.debug(`post(): id = ${id}`);
                const location: string = `${getBaseUri(req)}/${id}`;
                logger.debug(`post(): location = ${location}`);
                res.location(location);
                res.sendStatus(201);
            })
            .catch((err: any) => { res.sendStatus(500); });
    }

    @log
    put(req: Request, res: Response): void {
        if (req.header(contentType) === undefined
            || req.header(contentType).toLowerCase() !== applicationJson) {
            res.status(406);
            return;
        }

        const kanal: MDocument = new Kanal(req.body);
        logger.debug(`Body: ${JSON.stringify(kanal)}`);
        // siehe buch.ts, Zeile 77
        const err: any = validateKanal(kanal);
        if (err !== null) {
            logger.debug('status = 400');
            res.status(400).send(err);
            return;
        }

        this._kanaeleService
            // async. Aufruf fuer AWK mit DB-Zugriff
            .update(kanal)

            // Auswertung des async. Aufrufs
            .then(() => { res.sendStatus(204); })
            .catch((err: any) => { res.sendStatus(500); });
    }

    @log
    deleteMeth(req: Request, res: Response): void {
        const id: string = req.params.id;
        logger.debug(`id = ${id}`);

        this._kanaeleService
            // async. Aufruf fuer AWK mit DB-Zugriff
            .remove(id)

            // Auswertung des async. Aufrufs
            .then(() => { res.sendStatus(204); })
            .catch((err: any) => { res.sendStatus(500); });
    }

    toString(): string { return 'KanaeleRouter'; }
}

// -----------------------------------------------------------------------
// E x p o r t i e r t e   F u n c t i o n s
// -----------------------------------------------------------------------
const kanaeleRequestHandler: KanaeleRequestHandler =
    new KanaeleRequestHandler();
export function getById(req: Request, res: Response): void {
    'use strict';
    kanaeleRequestHandler.getById(req, res);
}

export function getByQuery(req: Request, res: Response): void {
    'use strict';
    kanaeleRequestHandler.getByQuery(req, res);
}

export function post(req: Request, res: Response): void {
    'use strict';
    kanaeleRequestHandler.post(req, res);
}

export function put(req: Request, res: Response): void {
    'use strict';
    kanaeleRequestHandler.put(req, res);
}

export function deleteFn(req: Request, res: Response): void {
    'use strict';
    kanaeleRequestHandler.deleteMeth(req, res);
}

/*
Generator-Function mit yield (ES2017) und Promise:

export function *myGeneratorFn(
    req: Request, res: Response): IterableIterator<any> {
    'use strict';
    try {
        const buecher: Array<MDocument> = yield fnReturningPromise(req.query);
        res.json(buecher);
    } catch (err) {
        res.sendStatus(500);
    }
}
*/
