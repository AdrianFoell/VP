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
const jwt = require('jsonwebtoken');
const moment = require('moment');
const uuid = require('node-uuid');
const abstract_iam_service_1 = require('../abstract_iam_service');
const roles_service_1 = require('../roles_service');
const users_service_1 = require('../users_service');
const shared_1 = require('../../../shared/shared');
class IamServiceJwt extends abstract_iam_service_1.default {
    constructor(...args) {
        super(...args);
        this._rolesService = new roles_service_1.default();
        this._usersService = new users_service_1.default();
    }
    login(req) {
        shared_1.logger.debug(`username: ${req.body.username}`);
        shared_1.logger.debug(`password: ${req.body.password}`);
        const username = req.body.username;
        shared_1.logger.debug(`username = ${username}`);
        const user = this._usersService.findByUserName(username);
        shared_1.logger.debug(`user = ${JSON.stringify(username)}`);
        const password = req.body.password;
        shared_1.logger.debug(`password = ${password}`);
        if (!this.checkPassword(user, password)) {
            return null;
        }
        // Expiration time in Millisekunden
        const expiration = moment().add('days', shared_1.expirationJwt).valueOf();
        const payload = {
            // JWT ID (hier: als generierte UUID)
            jti: uuid.v4(),
            // issuer
            iss: shared_1.issuerJwt,
            // subject
            sub: user.username,
            // audience
            aud: shared_1.audienceJwt,
            // implizit: iat = issued at
            // expiration time
            exp: expiration
        };
        const token = jwt.sign(payload, shared_1.secretJwt);
        return { token: token, roles: user.roles };
    }
    validateJwt(req) {
        // Die "Field Names" beim Request Header unterscheiden nicht zwischen
        // Gross- und Kleinschreibung (case-insensitive)
        // https://tools.ietf.org/html/rfc7230
        // http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2
        const auth = req.header('authorization');
        if (shared_1.isEmpty(auth)) {
            shared_1.logger.error('Kein Header-Field Authorization');
            return false;
        }
        shared_1.logger.debug(`Authorization = ${auth}`);
        const authParts = auth.split(' ');
        if (authParts.length !== 2) {
            shared_1.logger.error(`Fehler beim Header-Field Authorization: ${JSON.stringify(authParts)}`);
            return false;
        }
        const scheme = authParts[0];
        if (!/^Bearer$/i.test(scheme)) {
            shared_1.logger.error('Das Schema beim Header-Field Authorization muss Bearer sein');
            return false;
        }
        const token = authParts[1];
        // Verifikation des Tokens
        // try {
        //     jwt.verify(
        //         token, secretJwt, {issuer: issuerJwt, audience: audienceJwt});
        // } catch (err) {
        //     logger.error(`Fehler bei JWT.verify(): ${JSON.stringify(err)}`);
        //     return false;
        // }
        let verified = true;
        jwt.verify(token, shared_1.secretJwt, { issuer: shared_1.issuerJwt, audience: shared_1.audienceJwt }, (err, decoded) => {
            if (err) {
                shared_1.logger.error(`Fehler bei JWT.verify(): ${JSON.stringify(err)}`);
                verified = false;
            }
        });
        if (!verified) {
            return false;
        }
        const decodedToken = jwt.decode(token, { complete: true });
        shared_1.logger.debug(`decoded token = ${JSON.stringify(decodedToken)}`);
        // JWT abgelaufen, d.h. exp(iration) < aktuelles Datum?
        const payload = decodedToken.payload;
        const expiration = payload.exp;
        shared_1.logger.debug(`expiration = ${expiration}`);
        const now = Date.now();
        shared_1.logger.debug(`now = ${now}`);
        if (expiration < now) {
            return false;
        }
        return true;
    }
    hasAnyRole(req, roles) {
        const auth = req.header('Authorization');
        shared_1.logger.debug(`Authorization = ${auth}`);
        // der Wert des Header-Parameters "Authorization" beginnt mit "Bearer "
        const token = auth.substring(7);
        shared_1.logger.debug(`Bearer token = ${token}`);
        const decodedToken = jwt.decode(token, { complete: true });
        shared_1.logger.debug(`decoded token = ${JSON.stringify(decodedToken)}`);
        const subject = decodedToken.payload.sub;
        const user = this._usersService.findByUserName(subject);
        roles = this._rolesService.getNormalizedRoles(roles);
        return super.userHasAnyRole(user, roles);
    }
    toString() { return 'IamServiceJwt'; }
}
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Object)
], IamServiceJwt.prototype, "login", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Boolean)
], IamServiceJwt.prototype, "validateJwt", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Array]), 
    __metadata('design:returntype', Boolean)
], IamServiceJwt.prototype, "hasAnyRole", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IamServiceJwt;
