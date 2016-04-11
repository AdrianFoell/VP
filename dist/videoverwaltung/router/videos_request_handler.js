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
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const videos_service_1 = require('../service/videos_service');
const video_1 = require('../model/video');
const shared_1 = require('../../shared/shared');
class VideosRequestHandler {
    constructor() {
        this._videosService = new videos_service_1.default();
    }
    getById(req, res) {
        const id = req.params.id;
        shared_1.logger.debug(`id = ${id}`);
        this._videosService
            .findById(id)
            .then((video) => {
            if (shared_1.isBlank(video)) {
                shared_1.logger.debug('status = 404');
                res.sendStatus(404);
                return;
            }
            const baseUri = shared_1.getBaseUri(req);
            // Link Header
            res.links({
                self: `${baseUri}/${id}`,
                list: `${baseUri}`,
                add: `${baseUri}`,
                update: `${baseUri}`,
                remove: `${baseUri}/${id}`
            });
            shared_1.logger.debug(`getById(): video = ${JSON.stringify(video)}`);
            res.json(video);
        })
            .catch((err) => { res.sendStatus(500); });
    }
    getByQuery(req, res) {
        // z.B. https://.../buecher?titel=Alpha
        const query = req.query;
        shared_1.logger.debug(`queryParams = ${JSON.stringify(query)}`);
        this._videosService
            .find(query)
            .then((videos) => {
            shared_1.logger.debug(`getByQuery(): videos = ${JSON.stringify(videos)}`);
            if (videos.length === 0) {
                // Alternative: https://www.npmjs.com/package/http-errors
                // Damit wird aber auch der Stacktrace zum Client
                // uebertragen, weil das resultierende Fehlerobjekt
                // von Error abgeleitet ist.
                shared_1.logger.debug('status = 404');
                res.sendStatus(404);
                return;
            }
            // Link Header
            const baseUri = shared_1.getBaseUri(req);
            const firstId = videos[0]._id.valueOf();
            const lastId = videos[videos.length - 1]._id.valueOf();
            res.links({
                self: `${baseUri}`,
                list: `${baseUri}`,
                first: `${baseUri}/${firstId}`,
                last: `${baseUri}/${lastId}`
            });
            res.json(videos);
        })
            .catch((err) => { res.sendStatus(500); });
    }
    post(req, res) {
        if (req.header(shared_1.contentType) === undefined
            || req.header(shared_1.contentType).toLowerCase() !== shared_1.applicationJson) {
            shared_1.logger.debug('status = 406');
            res.sendStatus(406);
            return;
        }
        const video = new video_1.Video(req.body);
        shared_1.logger.debug(`Body: ${JSON.stringify(video)}`);
        const err = video_1.validateVideo(video);
        if (err !== null) {
            shared_1.logger.debug('status = 400');
            res.status(400).send(err);
            return;
        }
        this._videosService
            .save(video)
            .then((videoSaved) => {
            const id = videoSaved._id;
            shared_1.logger.debug(`post(): id = ${id}`);
            const location = `${shared_1.getBaseUri(req)}/${id}`;
            shared_1.logger.debug(`post(): location = ${location}`);
            res.location(location);
            res.sendStatus(201);
        })
            .catch((err) => { res.sendStatus(500); });
    }
    put(req, res) {
        if (req.header(shared_1.contentType) === undefined
            || req.header(shared_1.contentType).toLowerCase() !== shared_1.applicationJson) {
            res.status(406);
            return;
        }
        const video = new video_1.Video(req.body);
        shared_1.logger.debug(`Body: ${JSON.stringify(video)}`);
        // siehe buch.ts, Zeile 77
        const err = video_1.validateVideo(video);
        if (err !== null) {
            shared_1.logger.debug('status = 400');
            res.status(400).send(err);
            return;
        }
        this._videosService
            .update(video)
            .then(() => { res.sendStatus(204); })
            .catch((err) => { res.sendStatus(500); });
    }
    deleteMeth(req, res) {
        const id = req.params.id;
        shared_1.logger.debug(`id = ${id}`);
        this._videosService
            .remove(id)
            .then(() => { res.sendStatus(204); })
            .catch((err) => { res.sendStatus(500); });
    }
    toString() { return 'VideosRouter'; }
}
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object]), 
    __metadata('design:returntype', void 0)
], VideosRequestHandler.prototype, "getById", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object]), 
    __metadata('design:returntype', void 0)
], VideosRequestHandler.prototype, "getByQuery", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object]), 
    __metadata('design:returntype', void 0)
], VideosRequestHandler.prototype, "post", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object]), 
    __metadata('design:returntype', void 0)
], VideosRequestHandler.prototype, "put", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object]), 
    __metadata('design:returntype', void 0)
], VideosRequestHandler.prototype, "deleteMeth", null);
// -----------------------------------------------------------------------
// E x p o r t i e r t e   F u n c t i o n s
// -----------------------------------------------------------------------
const videosRequestHandler = new VideosRequestHandler();
function getById(req, res) {
    'use strict';
    videosRequestHandler.getById(req, res);
}
exports.getById = getById;
function getByQuery(req, res) {
    'use strict';
    videosRequestHandler.getByQuery(req, res);
}
exports.getByQuery = getByQuery;
function post(req, res) {
    'use strict';
    videosRequestHandler.post(req, res);
}
exports.post = post;
function put(req, res) {
    'use strict';
    videosRequestHandler.put(req, res);
}
exports.put = put;
function deleteFn(req, res) {
    'use strict';
    videosRequestHandler.deleteMeth(req, res);
}
exports.deleteFn = deleteFn;
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
