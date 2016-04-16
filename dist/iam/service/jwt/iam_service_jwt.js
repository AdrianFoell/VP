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
const jws_1 = require('jws');
const fs_1 = require('fs');
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
    // in Anlehnung an die Function sign() im Package express-jwt
    login(req) {
        shared_1.logger.debug(`username: ${req.body.username}`);
        shared_1.logger.debug(`password: ${req.body.password}`);
        const username = req.body.username;
        const user = this._usersService.findByUsername(username);
        shared_1.logger.debug(`user = ${JSON.stringify(username)}`);
        if (!this.checkPassword(user, req.body.password)) {
            return null;
        }
        const header = { typ: shared_1.TYP_JWT, alg: shared_1.ALG_JWT };
        // akt. Datum in Sek. seit 1.1.1970
        const current = Math.floor(Date.now() / 1000);
        const payload = {
            iat: current,
            // issuer
            iss: shared_1.ISSUER_JWT,
            // subject
            sub: user.email,
            // JWT ID (hier: als generierte UUID)
            jti: uuid.v4(),
            // audience
            aud: shared_1.AUDIENCE_JWT,
            // expiration time
            exp: current + shared_1.EXPIRATION_JWT
        };
        let secretOrPrivateKey;
        if (this._isHMAC(shared_1.ALG_JWT)) {
            secretOrPrivateKey = shared_1.SECRET_JWT;
        }
        else if (this._isRSA(shared_1.ALG_JWT)) {
            secretOrPrivateKey = IamServiceJwt.RSA_PRIVATE_KEY;
        }
        else if (this._isECDSA(shared_1.ALG_JWT)) {
            secretOrPrivateKey = IamServiceJwt.ECDSA_PRIVATE_KEY;
        }
        const signOptions = {
            header: header,
            payload: payload,
            secret: secretOrPrivateKey,
            encoding: shared_1.ENCODING_JWT
        };
        const token = jws_1.sign(signOptions);
        return {
            token: token,
            token_type: shared_1.BEARER_JWT,
            expires_in: shared_1.EXPIRATION_JWT,
            roles: user.roles
        };
    }
    // in Anlehnung an die Function verify() im Package express-jwt
    // Status codes gemaess OAuth 2
    //  https://tools.ietf.org/html/rfc6749#section-5.2
    //  https://tools.ietf.org/html/rfc6750#section-3.1
    validateJwt(req) {
        // Die "Field Names" beim Request Header unterscheiden nicht zwischen
        // Gross- und Kleinschreibung (case-insensitive)
        // https://tools.ietf.org/html/rfc7230
        // http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2
        const auth = req.header('Authorization');
        if (shared_1.isEmpty(auth)) {
            shared_1.logger.error('Kein Header-Field Authorization');
            return shared_1.TOKEN_INVALID;
        }
        shared_1.logger.debug(`Authorization = ${auth}`);
        // Destructuring in ES 2015
        const [scheme, tokenString] = auth.split(' ');
        if (shared_1.isEmpty(tokenString)) {
            shared_1.logger.error(`Fehler beim Header-Field Authorization: ${JSON.stringify(auth)}`);
            return shared_1.TOKEN_INVALID;
        }
        const bearerRegExp = new RegExp(`^${shared_1.BEARER_JWT}$`, 'i');
        if (!scheme.match(bearerRegExp)) {
            shared_1.logger.error(`Das Schema beim Header-Field Authorization muss ${shared_1.BEARER_JWT} sein`);
            return shared_1.TOKEN_INVALID;
        }
        /* tslint:disable:no-unused-variable */
        const [headerBase64, payloadBase64, signatureBase64] = tokenString.split('.');
        /* tslint:enable:no-unused-variable */
        if (shared_1.isEmpty(signatureBase64)) {
            shared_1.logger.error('Der Token besteht nicht aus 3 Teilen.');
            return shared_1.TOKEN_INVALID;
        }
        if (payloadBase64.trim() === '') {
            shared_1.logger.error('Die Payload des Tokens ist leer.');
            return shared_1.TOKEN_INVALID;
        }
        let tokenDecoded;
        try {
            tokenDecoded = jws_1.decode(tokenString);
        }
        catch (err) {
            shared_1.logger.error('Der JWT-Token kann nicht decodiert werden');
            return shared_1.TOKEN_INVALID;
        }
        if (shared_1.isBlank(tokenDecoded)) {
            shared_1.logger.error('Decodieren des Token-Strings liefert kein Token-Objekt');
            return shared_1.TOKEN_INVALID;
        }
        // Destructuring in ES 2015
        const { header, payload } = tokenDecoded;
        if (header.alg !== shared_1.ALG_JWT) {
            shared_1.logger.error(`Falscher ALgorithmus im Header: ${header.alg}`);
            return shared_1.TOKEN_INVALID;
        }
        let secretOrPublicKey;
        if (this._isHMAC(shared_1.ALG_JWT)) {
            secretOrPublicKey = shared_1.SECRET_JWT;
        }
        else if (this._isRSA(shared_1.ALG_JWT)) {
            secretOrPublicKey = IamServiceJwt.RSA_PUBLIC_KEY;
        }
        else if (this._isECDSA(shared_1.ALG_JWT)) {
            secretOrPublicKey = IamServiceJwt.ECDSA_PUBLIC_KEY;
        }
        let valid = true;
        try {
            valid = jws_1.verify(tokenString, header.alg, secretOrPublicKey);
        }
        catch (e) {
            shared_1.logger.error(`Der Token-String kann mit ${header.alg} nicht verifiziert werden`);
            return shared_1.TOKEN_INVALID;
        }
        if (!valid) {
            return shared_1.TOKEN_INVALID;
        }
        const { exp, iss, aud, sub } = payload;
        if (shared_1.isBlank(exp) || typeof exp !== 'number'
            || Math.floor(Date.now() / 1000) >= payload.exp) {
            shared_1.logger.error('Der Token ist abgelaufen');
            return shared_1.TOKEN_EXPIRED;
        }
        if (iss !== shared_1.ISSUER_JWT) {
            shared_1.logger.error(`Falscher issuer: ${iss}`);
            return shared_1.TOKEN_INVALID;
        }
        if (aud !== shared_1.AUDIENCE_JWT) {
            shared_1.logger.error(`Falsche audience: ${aud}`);
            return shared_1.TOKEN_INVALID;
        }
        // Request-Objekt um email erweitern
        shared_1.logger.debug(`email: ${sub}`);
        const tmp = req;
        tmp.email = sub;
        return shared_1.TOKEN_OK;
    }
    hasAnyRole(req, roles) {
        const tmp = req;
        const user = this._usersService.findByEmail(tmp.email);
        roles = this._rolesService.getNormalizedRoles(roles);
        return super.userHasAnyRole(user, roles);
    }
    toString() { return 'IamServiceJwt'; }
    // HMAC = Keyed-Hash MAC (= Message Authentication Code)
    _isHMAC(alg) { return alg.startsWith('HS'); }
    // RSA = Ron Rivest, Adi Shamir, Leonard Adleman
    _isRSA(alg) { return alg.startsWith('RS'); }
    // ECDSA = elliptic curve digital signature algorithm
    _isECDSA(alg) { return alg.startsWith('ES'); }
}
IamServiceJwt.RSA_PRIVATE_KEY = fs_1.readFileSync('iam/service/jwt/rsa.pem');
IamServiceJwt.RSA_PUBLIC_KEY = fs_1.readFileSync('iam/service/jwt/rsa.public.pem');
IamServiceJwt.ECDSA_PRIVATE_KEY = fs_1.readFileSync('iam/service/jwt/ecdsa.pem');
IamServiceJwt.ECDSA_PUBLIC_KEY = fs_1.readFileSync('iam/service/jwt/ecdsa.public.pem');
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
    __metadata('design:returntype', Number)
], IamServiceJwt.prototype, "validateJwt", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Array]), 
    __metadata('design:returntype', Boolean)
], IamServiceJwt.prototype, "hasAnyRole", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IamServiceJwt;
