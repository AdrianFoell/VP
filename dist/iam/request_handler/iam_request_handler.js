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
// basic-auth exportiert den Namespace auth und die gleichnamige Function
const basicAuth = require('basic-auth');
const iam_service_1 = require('../service/iam_service');
const shared_1 = require('../../shared/shared');
class IamRequestHandler {
    constructor() {
        this._iamService = new iam_service_1.default();
    }
    isLoggedIn(req, res, next) {
        const credentials = basicAuth(req);
        if (!this._isLoggedIn(credentials, res)) {
            return;
        }
        // Verarbeitung fortsetzen
        next();
    }
    isAdmin(req, res, next) {
        const credentials = basicAuth(req);
        if (!this._hasRolle(credentials, 'admin', res)) {
            return;
        }
        // Verarbeitung fortsetzen
        next();
    }
    isAdminMitarbeiter(req, res, next) {
        const credentials = basicAuth(req);
        if (!this._hasRolle(credentials, 'admin', res)
            && !this._hasRolle(credentials, 'mitarbeiter', res)) {
            return;
        }
        // Verarbeitung fortsetzen
        next();
    }
    toString() { return 'IamRequestHandler'; }
    _isLoggedIn(credentials, res) {
        if (shared_1.isBlank(credentials)) {
            shared_1.logger.debug('401: keine Credentials');
            res.sendStatus(401);
            return false;
        }
        const username = credentials.name;
        shared_1.logger.debug(`username = ${credentials.name}`);
        const password = credentials.pass;
        shared_1.logger.debug(`password = ${credentials.pass}`);
        const isLoggedIn = this._iamService.isLoggedIn(username, password);
        if (!isLoggedIn) {
            shared_1.logger.debug('401');
            res.sendStatus(401);
            return false;
        }
        return true;
    }
    _hasRolle(credentials, rolle, res) {
        shared_1.logger.debug(`Rolle = ${rolle}`);
        if (!this._isLoggedIn(credentials, res)) {
            shared_1.logger.debug('401');
            res.sendStatus(401);
            return false;
        }
        const username = credentials.name;
        const hasRole = this._iamService.hasRole(username, rolle);
        if (!hasRole) {
            shared_1.logger.debug('403');
            res.sendStatus(403);
        }
        return hasRole;
    }
}
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object, Function]), 
    __metadata('design:returntype', void 0)
], IamRequestHandler.prototype, "isLoggedIn", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object, Function]), 
    __metadata('design:returntype', void 0)
], IamRequestHandler.prototype, "isAdmin", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object, Function]), 
    __metadata('design:returntype', void 0)
], IamRequestHandler.prototype, "isAdminMitarbeiter", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object]), 
    __metadata('design:returntype', Boolean)
], IamRequestHandler.prototype, "_isLoggedIn", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, String, Object]), 
    __metadata('design:returntype', Boolean)
], IamRequestHandler.prototype, "_hasRolle", null);
// -----------------------------------------------------------------------
// E x p o r t i e r t e   F u n c t i o n s
// -----------------------------------------------------------------------
function isLoggedIn(req, res, next) {
    'use strict';
    new IamRequestHandler().isLoggedIn(req, res, next);
}
exports.isLoggedIn = isLoggedIn;
function isAdmin(req, res, next) {
    'use strict';
    new IamRequestHandler().isAdmin(req, res, next);
}
exports.isAdmin = isAdmin;
function isAdminMitarbeiter(req, res, next) {
    'use strict';
    new IamRequestHandler().isAdminMitarbeiter(req, res, next);
}
exports.isAdminMitarbeiter = isAdminMitarbeiter;
