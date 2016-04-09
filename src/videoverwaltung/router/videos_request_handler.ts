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

import VideosService from '../service/videos_service';
import {Video, validateVideo} from '../model/video';
import {getBaseUri, contentType, applicationJson, isBlank, log, logger} from '../../shared/shared';

class VideosRequestHandler {
    private _videosService: VideosService = new VideosService();

    @log
    getById(req: Request, res: Response): void {
        const id: string = req.params.id;
        logger.debug(`id = ${id}`);

        this._videosService
            // async. Aufruf AWK mit DB-Zugriff
            .findById(id)

            // Auswertung des async. Aufrufs
            .then((video: MDocument) => {
                if (isBlank(video)) {
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
                logger.debug(`getById(): video = ${JSON.stringify(video)}`);
                res.json(video);
            })
            .catch((err: any) => { res.sendStatus(500); });
    }

    @log
    getByQuery(req: Request, res: Response): void {
        // z.B. https://.../buecher?titel=Alpha
        const query: any = req.query;
        logger.debug(`queryParams = ${JSON.stringify(query)}`);

        this._videosService
            // async. Aufruf fuer AWK mit DB-Zugriff
            .find(query)

            // Auswertung des async. Aufrufs
            .then((videos: Array<MDocument>) => {
                logger.debug(
                    `getByQuery(): videos = ${JSON.stringify(videos)}`);

                if (videos.length === 0) {
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
                const firstId: string = <string>videos[0]._id.valueOf();
                const lastId: string =
                    <string>videos[videos.length - 1]._id.valueOf();
                res.links({
                    self: `${baseUri}`,
                    list: `${baseUri}`,
                    first: `${baseUri}/${firstId}`,
                    last: `${baseUri}/${lastId}`
                });

                res.json(videos);
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

        const video: MDocument = new Video(req.body);
        logger.debug(`Body: ${JSON.stringify(video)}`);
        const err: any = validateVideo(video);
        if (err !== null) {
            logger.debug('status = 400');
            res.status(400).send(err);
            return;
        }

        this._videosService
            // async. Aufruf fuer AWK mit DB-Zugriff
            .save(video)

            // Auswertung des async. Aufrufs
            .then((videoSaved: MDocument) => {
                const id: string = <string>videoSaved._id;
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

        const video: MDocument = new Video(req.body);
        logger.debug(`Body: ${JSON.stringify(video)}`);
        // siehe buch.ts, Zeile 77
        const err: any = validateVideo(video);
        if (err !== null) {
            logger.debug('status = 400');
            res.status(400).send(err);
            return;
        }

        this._videosService
            // async. Aufruf fuer AWK mit DB-Zugriff
            .update(video)

            // Auswertung des async. Aufrufs
            .then(() => { res.sendStatus(204); })
            .catch((err: any) => { res.sendStatus(500); });
    }

    @log
    deleteMeth(req: Request, res: Response): void {
        const id: string = req.params.id;
        logger.debug(`id = ${id}`);

        this._videosService
            // async. Aufruf fuer AWK mit DB-Zugriff
            .remove(id)

            // Auswertung des async. Aufrufs
            .then(() => { res.sendStatus(204); })
            .catch((err: any) => { res.sendStatus(500); });
    }

    toString(): string { return 'VideosRouter'; }
}

// -----------------------------------------------------------------------
// E x p o r t i e r t e   F u n c t i o n s
// -----------------------------------------------------------------------
const videosRequestHandler: VideosRequestHandler = new VideosRequestHandler();
export function getById(req: Request, res: Response): void {
    'use strict';
    videosRequestHandler.getById(req, res);
}

export function getByQuery(req: Request, res: Response): void {
    'use strict';
    videosRequestHandler.getByQuery(req, res);
}

export function post(req: Request, res: Response): void {
    'use strict';
    videosRequestHandler.post(req, res);
}

export function put(req: Request, res: Response): void {
    'use strict';
    videosRequestHandler.put(req, res);
}

export function deleteFn(req: Request, res: Response): void {
    'use strict';
    videosRequestHandler.deleteMeth(req, res);
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
