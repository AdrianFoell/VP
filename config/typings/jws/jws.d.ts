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

export interface IHeader {
    typ: 'JWT';
    alg: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384' | 'ES512';
}

export interface IPayload {
    iat: number;
    aud: string;
    iss: string;
    sub: string;
    jti: string | number;
    exp: number;
}

export interface ISignOptions {
    header: IHeader;
    payload: IPayload;
    secret: string | Buffer;
    encoding: 'utf8';
}

export interface IToken {
    header: IHeader;
    payload: IPayload;
    signature: string;
}

export function sign(options: ISignOptions): string;
export function decode(jwtString: string): IToken;
export function verify(jwtString: string, headerAlg: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384' | 'ES512', secretOrPublicKey: string | Buffer): boolean;
