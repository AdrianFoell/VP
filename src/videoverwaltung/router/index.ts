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

/* tslint:disable:max-line-length */
import {Router} from 'express';

// Einlesen von application/json im Request-Rumpf
// Fuer multimediale Daten (Videos, Bilder, Audios): raw-body
import {json} from 'body-parser';

import {getById, getByQuery, post, put, deleteFn} from './videos_request_handler';
import {validateJwt, isAdmin, isAdminMitarbeiter} from '../../iam/router/iam_request_handler';
import {validateMongoId} from '../../shared/shared';
/* tslint:enable:max-line-length */

// http://expressjs.com/en/api.html
// Ein Router ist eine "Mini-Anwendung" mit Express
const buecherRouter: Router = Router();
buecherRouter.route('/')
    .get(getByQuery)
    .post(validateJwt, isAdminMitarbeiter, json(), post)
    .put(validateJwt, isAdminMitarbeiter, json(), put);

const idParam: string = 'id';
buecherRouter.param(idParam, validateMongoId)
    .get(`/:${idParam}`, getById)
    .delete(`/:${idParam}`, validateJwt, isAdmin, deleteFn);

export default buecherRouter;
