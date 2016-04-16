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
const fs_1 = require('fs');
const mongoose_1 = require('mongoose');
// ----------------------------------------------------------
// h t t p s
// ----------------------------------------------------------
exports.HOST = 'localhost';
exports.PORT = 8443;
// https://nodejs.org/api/https.html
// https://nodejs.org/api/fs.html
exports.HTTPS_KEY = fs_1.readFileSync('https/key.pem');
exports.HTTPS_CERT = fs_1.readFileSync('https/cert.cer');
// ----------------------------------------------------------
// M I M E
// ----------------------------------------------------------
exports.CONTENT_TYPE = 'content-type';
exports.APPLICATION_JSON = 'application/json';
// ----------------------------------------------------------
// B u e c h e r
// ----------------------------------------------------------
exports.MAX_RATING = 5;
// ----------------------------------------------------------
// I A M
// ----------------------------------------------------------
exports.ROLES_USERS = 'files';
// NICHT implementiert:
// export const ROLES_USERS: string = 'db';
// export const ROLES_USERS: string = 'ldap';
// export const ROLES_USERS: string = 'keycloak';
exports.AUTH_METHOD = 'jwt';
// export const IAM: string = 'basic-auth';
// export const IAM: string = 'oauth2';
exports.TYP_JWT = 'JWT';
// HMAC = Keyed-Hash MAC (= Message Authentication Code)
// HS256 = HMAC mit SHA-256
// Bei SHA-3 ist HMAC nicht mehr notwendig.
// SHA-3 ist bei bei den Algorithmen fuer JWT *NICHT* aufgelistet:
// https://tools.ietf.org/html/rfc7518
// export const ALG_JWT: 'HS256'|'RS256'|'ES384' = 'HS256';
// RSA = Ron Rivest, Adi Shamir, Leonard Adleman
// RS256 = RSA mit SHA-256
// Google verwendet RS256
exports.ALG_JWT = 'RS256';
// ECDSA = Elliptic Curve Digital Signature Algorithm
// ECDSA hat bei gleicher Sicherheit deutlich kuerzere Schluessel, benoetigt
// aber mehr Rechenleistung. Beachte: die Schluessel werden nicht uebertragen!
// http://jwt.io kann nur HS256 und RS256
// export const ALG_JWT: 'HS256'|'RS256'|'ES384' = 'ES384';
// RSASSA-PSS wird durch jws nicht unterstuetzt
// https://github.com/brianloveswords/node-jws/issues/47
exports.ENCODING_JWT = 'utf8';
// ggf. als DN (= distinguished name) gemaess LDAP
exports.ISSUER_JWT = 'urn:Juergen.Zimmermann';
exports.SECRET_JWT = 'p';
exports.AUDIENCE_JWT = 'http://hska.de/jwt/v1/token';
exports.EXPIRATION_JWT = 24 * 60 * 60; // 1 Tag in Sek.
exports.BEARER_JWT = 'Bearer';
// Statuscodes fuer validierte Token
exports.TOKEN_OK = 0;
exports.TOKEN_INVALID = 1;
exports.TOKEN_EXPIRED = 2;
// ----------------------------------------------------------
// m o n g o o s e
// ----------------------------------------------------------
exports.MONGO_MOCK = false;
// In Produktion auf false setzen
exports.AUTO_INDEX = true;
// http://mongoosejs.com/docs/connections.html
// https://github.com/mongodb/node-mongodb-native
// Defaultwerte
//      Port        27017
//      Poolsize    5
const DB_USER = 'zimmermann';
const DB_PASSWORD = 'p';
const DB_HOST = '127.0.0.1';
// const DB_HOST: string = 'localhost';
const DB_NAME = 'mydb';
const DB_URL = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;
exports.dbConn = null;
if (!exports.MONGO_MOCK) {
    // Voraussetzung: Internet-Verbindung
    mongoose_1.connect(DB_URL);
    exports.dbConn = mongoose_1.connection;
    exports.dbConn.on('error', console.error.bind(console, 'FEHLER beim Aufbau der Datenbank-Verbindung:\n'));
}
// ----------------------------------------------------------
// w i n s t o n
// ----------------------------------------------------------
// https://github.com/winstonjs/winston/blob/master/docs/transports.md
exports.LOG_OPTIONS = {
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
