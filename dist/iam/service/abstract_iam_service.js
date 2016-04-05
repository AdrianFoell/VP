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
// node-forge als Alternative zu crypto-js enthaelt nicht SHA-3
// https://code.google.com/archive/p/crypto-js
const crypto_js_1 = require('crypto-js');
const shared_1 = require('../../shared/shared');
class AbstractIamService {
    // JWT: ueberladen bzw. neu implementieren
    // Basic Authentifiizierung: irrelevant, d.h. kein ueberladen
    validateJwt(req) { return true; }
    // JWT: bereits erledigt durch Validierung des Tokens
    // Basic Authentifiizierung: ueberladen bzw. neu implementieren
    isLoggedIn(req) { return true; }
    userHasAnyRole(user, roles) {
        if (shared_1.isBlank(user) || shared_1.isBlank(roles) || roles.length === 0) {
            return false;
        }
        const userRoles = user.roles;
        let found = false;
        roles.forEach(role => {
            if (userRoles.find(userRole => userRole === role) !== undefined) {
                shared_1.logger.debug(`Vorhandene Rolle: ${role}`);
                found = true;
            }
        });
        return found;
    }
    checkPassword(user, password) {
        if (user === null) {
            shared_1.logger.debug('Falscher Username');
            return false;
        }
        // Der Hashwert ist ein WordArray-Objekt mit Default-Laenge 512 Bit
        const hashWordArray = crypto_js_1.SHA3(password);
        const hashBase64 = hashWordArray.toString(crypto_js_1.enc.Base64);
        return user.password === hashBase64;
    }
    toString() { return 'AbstractIamService'; }
}
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Boolean)
], AbstractIamService.prototype, "validateJwt", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Boolean)
], AbstractIamService.prototype, "isLoggedIn", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Array]), 
    __metadata('design:returntype', Boolean)
], AbstractIamService.prototype, "userHasAnyRole", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, String]), 
    __metadata('design:returntype', Boolean)
], AbstractIamService.prototype, "checkPassword", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AbstractIamService;
