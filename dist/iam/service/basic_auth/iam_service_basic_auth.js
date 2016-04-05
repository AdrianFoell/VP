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
const abstract_iam_service_1 = require('../abstract_iam_service');
const roles_service_1 = require('../roles_service');
const users_service_1 = require('../users_service');
const shared_1 = require('../../../shared/shared');
class IamServiceBasicAuth extends abstract_iam_service_1.default {
    constructor(...args) {
        super(...args);
        this._rolesService = new roles_service_1.default();
        this._usersService = new users_service_1.default();
    }
    login(req) {
        const credentials = basicAuth(req);
        if (shared_1.isBlank(credentials)) {
            shared_1.logger.debug('isBlank(credentials)');
            return null;
        }
        const username = credentials.name;
        shared_1.logger.debug(`username = ${credentials.name}`);
        const user = this._usersService.findByUserName(username);
        const password = credentials.pass;
        shared_1.logger.debug(`password = ${credentials.pass}`);
        if (!this.checkPassword(user, password)) {
            return null;
        }
        return user.roles;
    }
    isLoggedIn(req) {
        const credentials = basicAuth(req);
        if (shared_1.isBlank(credentials)) {
            shared_1.logger.debug('isBlank(credentials)');
            return false;
        }
        const username = credentials.name;
        shared_1.logger.debug(`username = ${credentials.name}`);
        const user = this._usersService.findByUserName(username);
        const password = credentials.pass;
        shared_1.logger.debug(`password = ${credentials.pass}`);
        return this.checkPassword(user, password);
    }
    hasAnyRole(req, roles) {
        const credentials = basicAuth(req);
        if (shared_1.isBlank(credentials)) {
            shared_1.logger.debug('isBlank(credentials)');
            return false;
        }
        const username = credentials.name;
        shared_1.logger.debug(`username = ${credentials.name}`);
        const user = this._usersService.findByUserName(username);
        roles = this._rolesService.getNormalizedRoles(roles);
        return super.userHasAnyRole(user, roles);
    }
    toString() { return 'IamServiceBasicAuth'; }
}
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Array)
], IamServiceBasicAuth.prototype, "login", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Boolean)
], IamServiceBasicAuth.prototype, "isLoggedIn", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Array]), 
    __metadata('design:returntype', Boolean)
], IamServiceBasicAuth.prototype, "hasAnyRole", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IamServiceBasicAuth;
