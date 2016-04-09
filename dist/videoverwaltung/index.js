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
// Routing, Request-Handler, Request- und Response-Objekt
const express_1 = require('express');
// Einlesen von application/json im Request-Rumpf
const body_parser_1 = require('body-parser');
const videos_request_handler_1 = require('./router/videos_request_handler');
const iam_request_handler_1 = require('../iam/router/iam_request_handler');
const shared_1 = require('../shared/shared');
// http://expressjs.com/en/api.html
const videosRouter = express_1.Router();
videosRouter.route('/')
    .get(videos_request_handler_1.getByQuery)
    .post(iam_request_handler_1.isAdminMitarbeiter, body_parser_1.json(), videos_request_handler_1.post)
    .put(iam_request_handler_1.isAdminMitarbeiter, body_parser_1.json(), videos_request_handler_1.put);
videosRouter.param('id', shared_1.validateMongoId)
    .get('/:id', videos_request_handler_1.getById)
    .delete('/:id', iam_request_handler_1.isAdmin, videos_request_handler_1.deleteFn);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = videosRouter;
