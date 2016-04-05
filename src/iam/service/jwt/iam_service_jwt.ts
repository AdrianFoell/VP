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
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import * as uuid from 'node-uuid';

import AbstractIamService from '../abstract_iam_service';
import RolesService from '../roles_service';
import UsersService from '../users_service';
import {log, logger, issuerJwt, secretJwt, audienceJwt, expirationJwt, isEmpty} from '../../../shared/shared';
/* tslint:enable:max-line-length */

interface ILoginResultJwt {
    token: string;
    roles?: Array<string>;
}

export default class IamServiceJwt extends AbstractIamService {
    private _rolesService: RolesService = new RolesService();
    private _usersService: UsersService = new UsersService();

    @log
    login(req: Request): ILoginResultJwt {
        logger.debug(`username: ${req.body.username}`);
        logger.debug(`password: ${req.body.password}`);
        const username: string = req.body.username;
        logger.debug(`username = ${username}`);
        const user: any = this._usersService.findByUserName(username);
        logger.debug(`user = ${JSON.stringify(username)}`);

        const password: string = req.body.password;
        logger.debug(`password = ${password}`);

        if (!this.checkPassword(user, password)) {
            return null;
        }

        // Expiration time in Millisekunden
        const expiration: number =
            moment().add('days', expirationJwt).valueOf();
        const payload: any = {
            // JWT ID (hier: als generierte UUID)
            jti: uuid.v4(),
            // issuer
            iss: issuerJwt,
            // subject
            sub: user.username,
            // audience
            aud: audienceJwt,
            // implizit: iat = issued at
            // expiration time
            exp: expiration
            // nbf = not before
        };
        const token: string = jwt.sign(payload, secretJwt);

        return {token: token, roles: user.roles};
    }

    @log
    validateJwt(req: Request): boolean {
        // Die "Field Names" beim Request Header unterscheiden nicht zwischen
        // Gross- und Kleinschreibung (case-insensitive)
        // https://tools.ietf.org/html/rfc7230
        // http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2
        const auth: string = req.header('authorization');
        if (isEmpty(auth)) {
            logger.error('Kein Header-Field Authorization');
            return false;
        }
        logger.debug(`Authorization = ${auth}`);

        const authParts: Array<string> = auth.split(' ');
        if (authParts.length !== 2) {
            logger.error(
                `Fehler beim Header-Field Authorization: ${JSON.stringify(authParts)}`);
            return false;
        }

        const scheme: string = authParts[0];
        if (!/^Bearer$/i.test(scheme)) {
            logger.error(
                'Das Schema beim Header-Field Authorization muss Bearer sein');
            return false;
        }

        const token: string = authParts[1];

        // Verifikation des Tokens
        try {
            jwt.verify(
                token, secretJwt, {issuer: issuerJwt, audience: audienceJwt});
        } catch (err) {
            logger.error(`Fehler bei JWT.verify(): ${JSON.stringify(err)}`);
            return false;
        }

        const decodedToken: any = jwt.decode(token, {complete: true});
        logger.debug(`decoded token = ${JSON.stringify(decodedToken)}`);

        // JWT abgelaufen, d.h. exp(iration) < aktuelles Datum?
        const payload: any = decodedToken.payload;
        const expiration: number = payload.exp;
        logger.debug(`expiration = ${expiration}`);
        const now: number = Date.now();
        logger.debug(`now = ${now}`);
        if (expiration < now) {
            return false;
        }

        return true;
    }

    @log
    hasAnyRole(req: Request, roles: Array<string>): boolean {
        const auth: string = req.header('Authorization');
        logger.debug(`Authorization = ${auth}`);
        // der Wert des Header-Parameters "Authorization" beginnt mit "Bearer "
        const token: string = auth.substring(7);
        logger.debug(`Bearer token = ${token}`);
        const decodedToken: any = jwt.decode(token, {complete: true});
        logger.debug(`decoded token = ${JSON.stringify(decodedToken)}`);
        const subject: string = decodedToken.payload.sub;

        const user: any = this._usersService.findByUserName(subject);

        roles = this._rolesService.getNormalizedRoles(roles);
        return super.userHasAnyRole(user, roles);
    }

    toString(): string { return 'IamServiceJwt'; }
}
