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
exports.host = 'localhost';
exports.port = 8443;
// https://nodejs.org/api/https.html
// https://nodejs.org/api/fs.html
exports.httpsKey = fs_1.readFileSync('https/key.pem');
exports.httpsCert = fs_1.readFileSync('https/cert.cer');
// ----------------------------------------------------------
// M I M E
// ----------------------------------------------------------
exports.contentType = 'content-type';
exports.applicationJson = 'application/json';
// ----------------------------------------------------------
// B u e c h e r
// ----------------------------------------------------------
exports.MAX_RATING = 5;
// ----------------------------------------------------------
// I A M
// ----------------------------------------------------------
exports.rolesUsers = 'files';
// export const rolesUsers: string = 'db';
// export const rolesUsers: string = 'ldap';
// export const rolesUsers: string = 'keycloak';
// export const iam: string = 'basic-auth';
exports.iam = 'jwt';
// export const iam: string = 'oauth2';
exports.issuerJwt = 'Juergen Zimmermann';
exports.secretJwt = 'p';
exports.audienceJwt = 'hska.de';
exports.expirationJwt = 1; // Tage
// ----------------------------------------------------------
// m o n g o o s e
// ----------------------------------------------------------
exports.mongoMock = false;
// In Produktion auf false setzen
exports.autoIndex = true;
// http://mongoosejs.com/docs/connections.html
// https://github.com/mongodb/node-mongodb-native
// Defaultwerte
//      Port        27017
//      Poolsize    5
const dbUser = 'zimmermann';
const dbPassword = 'p';
const dbHost = 'localhost';
const dbName = 'buchdb';
const dbUrl = `mongodb://${dbUser}:${dbPassword}@${dbHost}/${dbName}`;
exports.dbConn = null;
if (!exports.mongoMock) {
    // Voraussetzung: Internet-Verbindung
    mongoose_1.connect(dbUrl);
    exports.dbConn = mongoose_1.connection;
    exports.dbConn.on('error', console.error.bind(console, 'FEHLER beim Aufbau der Datenbank-Verbindung:\n'));
}
// ----------------------------------------------------------
// w i n s t o n
// ----------------------------------------------------------
// https://github.com/winstonjs/winston/blob/master/docs/transports.md
exports.logOptions = {
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
