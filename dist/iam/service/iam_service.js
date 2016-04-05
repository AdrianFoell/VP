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
const abstract_iam_service_1 = require('./abstract_iam_service');
const iam_service_jwt_1 = require('./jwt/iam_service_jwt');
const iam_service_basic_auth_1 = require('./basic_auth/iam_service_basic_auth');
const shared_1 = require('../../shared/shared');
class IamService extends abstract_iam_service_1.default {
    constructor() {
        super();
        switch (shared_1.iam) {
            case 'jwt':
                this._impl = new iam_service_jwt_1.default();
                break;
            case 'basic-auth':
                this._impl = new iam_service_basic_auth_1.default();
                break;
            default:
                throw new Error('Es ist nur "JWT" und "Basic Authentication" verfuegbar');
        }
    }
    login(req) { return this._impl.login(req); }
    validateJwt(req) { return this._impl.validateJwt(req); }
    isLoggedIn(req) { return this._impl.isLoggedIn(req); }
    hasAnyRole(req, roles) {
        return this._impl.hasAnyRole(req, roles);
    }
    toString() { return 'IamService'; }
}
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Object)
], IamService.prototype, "login", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Boolean)
], IamService.prototype, "validateJwt", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Boolean)
], IamService.prototype, "isLoggedIn", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Array]), 
    __metadata('design:returntype', Boolean)
], IamService.prototype, "hasAnyRole", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IamService;
