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

// Routing, Request-Handler, Request- und Response-Objekt
import {Router} from 'express';

// Einlesen von application/json im Request-Rumpf
import {json} from 'body-parser';

import {
    getById,
    getByQuery,
    post,
    put,
    deleteFn
} from './router/videos_request_handler';
import {
    isAdmin,
    isAdminMitarbeiter
} from '../iam/router/iam_request_handler';
import {validateMongoId} from '../shared/shared';

// http://expressjs.com/en/api.html
const videosRouter: Router = Router();
videosRouter.route('/')
    .get(getByQuery)
    .post(isAdminMitarbeiter, json(), post)
    .put(isAdminMitarbeiter, json(), put);

videosRouter.param('id', validateMongoId)
    .get('/:id', getById)
    .delete('/:id', isAdmin, deleteFn);

export default videosRouter;
