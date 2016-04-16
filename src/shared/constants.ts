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

import {readFileSync} from 'fs';
import {Connection, connect, connection} from 'mongoose';

// ----------------------------------------------------------
// h t t p s
// ----------------------------------------------------------
export const HOST: string = 'localhost';
export const PORT: number = 8443;

// https://nodejs.org/api/https.html
// https://nodejs.org/api/fs.html
export const HTTPS_KEY: Buffer = readFileSync('https/key.pem');
export const HTTPS_CERT: Buffer = readFileSync('https/cert.cer');

// ----------------------------------------------------------
// M I M E
// ----------------------------------------------------------
export const CONTENT_TYPE: string = 'content-type';
export const APPLICATION_JSON: string = 'application/json';

// ----------------------------------------------------------
// B u e c h e r
// ----------------------------------------------------------
export const MAX_RATING: number = 5;

// ----------------------------------------------------------
// I A M
// ----------------------------------------------------------
export const ROLES_USERS: string = 'files';
// NICHT implementiert:
// export const ROLES_USERS: string = 'db';
// export const ROLES_USERS: string = 'ldap';
// export const ROLES_USERS: string = 'keycloak';

export const AUTH_METHOD: string = 'jwt';
// export const IAM: string = 'basic-auth';
// export const IAM: string = 'oauth2';

export const TYP_JWT: 'JWT' = 'JWT';

// HMAC = Keyed-Hash MAC (= Message Authentication Code)
// HS256 = HMAC mit SHA-256
// Bei SHA-3 ist HMAC nicht mehr notwendig.
// SHA-3 ist bei bei den Algorithmen fuer JWT *NICHT* aufgelistet:
// https://tools.ietf.org/html/rfc7518
// export const ALG_JWT: 'HS256'|'RS256'|'ES384' = 'HS256';

// RSA = Ron Rivest, Adi Shamir, Leonard Adleman
// RS256 = RSA mit SHA-256
// Google verwendet RS256
export const ALG_JWT: 'HS256'|'RS256'|'ES384' = 'RS256';

// ECDSA = Elliptic Curve Digital Signature Algorithm
// ECDSA hat bei gleicher Sicherheit deutlich kuerzere Schluessel, benoetigt
// aber mehr Rechenleistung. Beachte: die Schluessel werden nicht uebertragen!
// http://jwt.io kann nur HS256 und RS256
// export const ALG_JWT: 'HS256'|'RS256'|'ES384' = 'ES384';

// RSASSA-PSS wird durch jws nicht unterstuetzt
// https://github.com/brianloveswords/node-jws/issues/47

export const ENCODING_JWT: 'utf8' = 'utf8';
// ggf. als DN (= distinguished name) gemaess LDAP
export const ISSUER_JWT: string = 'urn:Juergen.Zimmermann';
export const SECRET_JWT: string|Buffer = 'p';
export const AUDIENCE_JWT: string = 'http://hska.de/jwt/v1/token';
export const EXPIRATION_JWT: number = 24 * 60 * 60;  // 1 Tag in Sek.
export const BEARER_JWT: 'Bearer' = 'Bearer';

// Statuscodes fuer validierte Token
export const TOKEN_OK: number = 0;
export const TOKEN_INVALID: number = 1;
export const TOKEN_EXPIRED: number = 2;

// ----------------------------------------------------------
// m o n g o o s e
// ----------------------------------------------------------
export const MONGO_MOCK: boolean = false;

// In Produktion auf false setzen
export const AUTO_INDEX: boolean = true;

// http://mongoosejs.com/docs/connections.html
// https://github.com/mongodb/node-mongodb-native
// Defaultwerte
//      Port        27017
//      Poolsize    5
const DB_USER: string = 'zimmermann';
const DB_PASSWORD: string = 'p';
const DB_HOST: string = '127.0.0.1';
// const DB_HOST: string = 'localhost';
const DB_NAME: string = 'mydb';
const DB_URL: string =
    `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

export let dbConn: Connection = null;
if (!MONGO_MOCK) {
    // Voraussetzung: Internet-Verbindung
    connect(DB_URL);
    dbConn = connection;
    dbConn.on(
        'error',
        console.error.bind(
            console, 'FEHLER beim Aufbau der Datenbank-Verbindung:\n'));
}

// ----------------------------------------------------------
// w i n s t o n
// ----------------------------------------------------------
// https://github.com/winstonjs/winston/blob/master/docs/transports.md
export const LOG_OPTIONS: any = {
    console: {
        colorize: true,
        prettyPrint: true,
        humanReadableUnhandledException: true
    },
    file: {
        // default: winston.log
        filename: 'server.log',
        level: 'debug',
        // 250 KB
        maxsize: 250000,
        maxFiles: 3,
        json: false,
        zippedArchive: true
    }
};
