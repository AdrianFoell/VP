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
import {Request} from 'express';

import {IHeader, IPayload, ISignOptions, IToken, sign, decode, verify} from 'jws';
import {readFileSync} from 'fs';
import * as uuid from 'node-uuid';

import AbstractIamService from '../abstract_iam_service';
import RolesService from '../roles_service';
import UsersService from '../users_service';
import {log, logger, TYP_JWT, ALG_JWT, ISSUER_JWT, SECRET_JWT, AUDIENCE_JWT, EXPIRATION_JWT, ENCODING_JWT, BEARER_JWT, TOKEN_OK, TOKEN_INVALID, TOKEN_EXPIRED, isEmpty, isBlank} from '../../../shared/shared';
/* tslint:enable:max-line-length */

interface ILoginResultJwt {
    token: string;
    token_type: 'Bearer';
    expires_in: number;
    roles?: Array<string>;
}

export default class IamServiceJwt extends AbstractIamService {
    private static RSA_PRIVATE_KEY: Buffer =
        readFileSync('iam/service/jwt/rsa.pem');
    private static RSA_PUBLIC_KEY: Buffer =
        readFileSync('iam/service/jwt/rsa.public.pem');
    private static ECDSA_PRIVATE_KEY: Buffer =
        readFileSync('iam/service/jwt/ecdsa.pem');
    private static ECDSA_PUBLIC_KEY: Buffer =
        readFileSync('iam/service/jwt/ecdsa.public.pem');

    private _rolesService: RolesService = new RolesService();
    private _usersService: UsersService = new UsersService();

    // in Anlehnung an die Function sign() im Package express-jwt
    @log
    login(req: Request): ILoginResultJwt {
        logger.debug(`username: ${req.body.username}`);
        logger.debug(`password: ${req.body.password}`);
        const username: string = req.body.username;
        const user: any = this._usersService.findByUsername(username);
        logger.debug(`user = ${JSON.stringify(username)}`);

        if (!this.checkPassword(user, req.body.password)) {
            return null;
        }

        const header: IHeader = {typ: TYP_JWT, alg: ALG_JWT};
        // akt. Datum in Sek. seit 1.1.1970
        const current: number = Math.floor(Date.now() / 1000);
        const payload: IPayload = {
            iat: current,
            // issuer
            iss: ISSUER_JWT,
            // subject
            sub: user.email,
            // JWT ID (hier: als generierte UUID)
            jti: uuid.v4(),
            // audience
            aud: AUDIENCE_JWT,
            // expiration time
            exp: current + EXPIRATION_JWT
            // nbf = not before
        };

        let secretOrPrivateKey: string|Buffer;
        if (this._isHMAC(ALG_JWT)) {
            secretOrPrivateKey = SECRET_JWT;
        } else if (this._isRSA(ALG_JWT)) {
            secretOrPrivateKey = IamServiceJwt.RSA_PRIVATE_KEY;
        } else if (this._isECDSA(ALG_JWT)) {
            secretOrPrivateKey = IamServiceJwt.ECDSA_PRIVATE_KEY;
        }
        const signOptions: ISignOptions = {
            header: header,
            payload: payload,
            secret: secretOrPrivateKey,
            encoding: ENCODING_JWT
        };
        const token: string = sign(signOptions);

        return {
            token: token,
            token_type: BEARER_JWT,
            expires_in: EXPIRATION_JWT,
            roles: user.roles
        };
    }

    // in Anlehnung an die Function verify() im Package express-jwt
    // Status codes gemaess OAuth 2
    //  https://tools.ietf.org/html/rfc6749#section-5.2
    //  https://tools.ietf.org/html/rfc6750#section-3.1
    @log
    validateJwt(req: Request): number {
        // Die "Field Names" beim Request Header unterscheiden nicht zwischen
        // Gross- und Kleinschreibung (case-insensitive)
        // https://tools.ietf.org/html/rfc7230
        // http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2
        const auth: string = req.header('Authorization');
        if (isEmpty(auth)) {
            logger.error('Kein Header-Field Authorization');
            return TOKEN_INVALID;
        }
        logger.debug(`Authorization = ${auth}`);

        // Destructuring in ES 2015
        const[scheme, tokenString]: Array<string> = auth.split(' ');
        if (isEmpty(tokenString)) {
            logger.error(
                `Fehler beim Header-Field Authorization: ${JSON.stringify(auth)}`);
            return TOKEN_INVALID;
        }

        const bearerRegExp: RegExp = new RegExp(`^${BEARER_JWT}$`, 'i');
        if (!scheme.match(bearerRegExp)) {
            logger.error(
                `Das Schema beim Header-Field Authorization muss ${BEARER_JWT} sein`);
            return TOKEN_INVALID;
        }

        /* tslint:disable:no-unused-variable */
        const[headerBase64, payloadBase64, signatureBase64]: Array<string> =
            tokenString.split('.');
        /* tslint:enable:no-unused-variable */
        if (isEmpty(signatureBase64)) {
            logger.error('Der Token besteht nicht aus 3 Teilen.');
            return TOKEN_INVALID;
        }
        if (payloadBase64.trim() === '') {
            logger.error('Die Payload des Tokens ist leer.');
            return TOKEN_INVALID;
        }

        let tokenDecoded: IToken;
        try {
            tokenDecoded = decode(tokenString);
        } catch (err) {
            logger.error('Der JWT-Token kann nicht decodiert werden');
            return TOKEN_INVALID;
        }
        if (isBlank(tokenDecoded)) {
            logger.error(
                'Decodieren des Token-Strings liefert kein Token-Objekt');
            return TOKEN_INVALID;
        }

        // Destructuring in ES 2015
        const {header, payload}: any = tokenDecoded;
        if (header.alg !== ALG_JWT) {
            logger.error(`Falscher ALgorithmus im Header: ${header.alg}`);
            return TOKEN_INVALID;
        }

        let secretOrPublicKey: string|Buffer;
        if (this._isHMAC(ALG_JWT)) {
            secretOrPublicKey = SECRET_JWT;
        } else if (this._isRSA(ALG_JWT)) {
            secretOrPublicKey = IamServiceJwt.RSA_PUBLIC_KEY;
        } else if (this._isECDSA(ALG_JWT)) {
            secretOrPublicKey = IamServiceJwt.ECDSA_PUBLIC_KEY;
        }

        let valid: boolean = true;
        try {
            valid = verify(tokenString, header.alg, secretOrPublicKey);
        } catch (e) {
            logger.error(
                `Der Token-String kann mit ${header.alg} nicht verifiziert werden`);
            return TOKEN_INVALID;
        }
        if (!valid) {
            return TOKEN_INVALID;
        }

        const {exp, iss, aud, sub}: any = payload;
        if (isBlank(exp) || typeof exp !== 'number'
            || Math.floor(Date.now() / 1000) >= payload.exp) {
            logger.error('Der Token ist abgelaufen');
            return TOKEN_EXPIRED;
        }

        if (iss !== ISSUER_JWT) {
            logger.error(`Falscher issuer: ${iss}`);
            return TOKEN_INVALID;
        }
        if (aud !== AUDIENCE_JWT) {
            logger.error(`Falsche audience: ${aud}`);
            return TOKEN_INVALID;
        }

        // Request-Objekt um email erweitern
        logger.debug(`email: ${sub}`);
        const tmp: any = req;
        tmp.email = sub;
        return TOKEN_OK;
    }

    @log
    hasAnyRole(req: Request, roles: Array<string>): boolean {
        const tmp: any = req;
        const user: any = this._usersService.findByEmail(tmp.email);
        roles = this._rolesService.getNormalizedRoles(roles);
        return super.userHasAnyRole(user, roles);
    }

    toString(): string { return 'IamServiceJwt'; }

    // HMAC = Keyed-Hash MAC (= Message Authentication Code)
    private _isHMAC(alg: string): boolean { return alg.startsWith('HS'); }

    // RSA = Ron Rivest, Adi Shamir, Leonard Adleman
    private _isRSA(alg: string): boolean { return alg.startsWith('RS'); }

    // ECDSA = elliptic curve digital signature algorithm
    private _isECDSA(alg: string): boolean { return alg.startsWith('ES'); }
}
