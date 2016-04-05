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
const validator_1 = require('validator');
const shared_1 = require('./shared');
class SharedRequestHandler {
    logRequestHeader(req, res, next) {
        shared_1.logger.debug(`Request: headers=${JSON.stringify(req.headers, null, 2)}`);
        shared_1.logger.debug(`Request: protocol=${JSON.stringify(req.protocol, null, 2)}`);
        shared_1.logger.debug(`Request: hostname=${JSON.stringify(req.hostname, null, 2)}`);
        if (req.body !== undefined) {
            shared_1.logger.debug(`Request: body=${JSON.stringify(req.body, null, 2)}`);
        }
        Object.keys(req).forEach((key) => {
            if (req.hasOwnProperty(key)) {
                shared_1.logger.log('silly', `Request-Key: ${key}`);
            }
        });
        // Request-Verarbeitung fortsetzen
        next();
    }
    validateMongoId(req, res, next, id) {
        shared_1.logger.debug(`id = ${id}`);
        if (!shared_1.isMongoId(id)) {
            shared_1.logger.debug('status = 400');
            res.status(400).send(`${id} ist keine gueltige Buch-ID`);
        }
        next();
    }
    validateUUID(req, res, next, id) {
        if (!validator_1.isUUID(id)) {
            shared_1.logger.debug('status = 400');
            res.status(400).send(`${id} ist keine gueltige Buch-ID`);
            return;
        }
        next();
    }
    notYetImplemented(req, res) {
        res.sendStatus(501);
    }
    toString() { return 'SharedRequestHandler'; }
}
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object, Function]), 
    __metadata('design:returntype', void 0)
], SharedRequestHandler.prototype, "logRequestHeader", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object, Function, Object]), 
    __metadata('design:returntype', void 0)
], SharedRequestHandler.prototype, "validateMongoId", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object, Function, Object]), 
    __metadata('design:returntype', void 0)
], SharedRequestHandler.prototype, "validateUUID", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object]), 
    __metadata('design:returntype', void 0)
], SharedRequestHandler.prototype, "notYetImplemented", null);
// -----------------------------------------------------------------------
// E x p o r t i e r t e   F u n c t i o n s
// -----------------------------------------------------------------------
function logRequestHeader(req, res, next) {
    'use strict';
    new SharedRequestHandler().logRequestHeader(req, res, next);
}
exports.logRequestHeader = logRequestHeader;
function validateMongoId(req, res, next, id) {
    'use strict';
    new SharedRequestHandler().validateMongoId(req, res, next, id);
}
exports.validateMongoId = validateMongoId;
function validateUUID(req, res, next, id) {
    'use strict';
    new SharedRequestHandler().validateUUID(req, res, next, id);
}
exports.validateUUID = validateUUID;
function notYetImplemented(req, res) {
    'use strict';
    new SharedRequestHandler().notYetImplemented(req, res);
}
exports.notYetImplemented = notYetImplemented;
