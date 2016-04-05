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
const express_1 = require('express');
// MIME-Typ application/x-www-form-urlencoded
const body_parser_1 = require('body-parser');
const iam_request_handler_1 = require('./iam_request_handler');
const loginRouter = express_1.Router();
loginRouter.route('/').post(body_parser_1.urlencoded({ extended: false, type: 'application/x-www-form-urlencoded' }), iam_request_handler_1.login);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = loginRouter;
