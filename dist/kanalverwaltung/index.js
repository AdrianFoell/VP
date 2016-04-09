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
const shared_1 = require('../shared/shared');
const kanaeleRouter = express_1.Router();
kanaeleRouter.get('/', shared_1.logRequestHeader, shared_1.addSecurityHeader, shared_1.notYetImplemented);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = kanaeleRouter;