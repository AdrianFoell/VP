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
export const host: string = 'localhost';
export const port: number = 8443;

// https://nodejs.org/api/https.html
// https://nodejs.org/api/fs.html
export const httpsKey: Buffer = readFileSync('https/key.pem');
export const httpsCert: Buffer = readFileSync('https/cert.cer');

// ----------------------------------------------------------
// M I M E
// ----------------------------------------------------------
export const contentType: string = 'content-type';
export const applicationJson: string = 'application/json';

// ----------------------------------------------------------
// B u e c h e r
// ----------------------------------------------------------
export const MAX_RATING: number = 5;

// ----------------------------------------------------------
// I A M
// ----------------------------------------------------------
export const rolesUsers: string = 'files';
// export const rolesUsers: string = 'db';
// export const rolesUsers: string = 'ldap';
// export const rolesUsers: string = 'keycloak';

// export const iam: string = 'basic-auth';
export const iam: string = 'jwt';
// export const iam: string = 'oauth2';

export const issuerJwt: string = 'Juergen Zimmermann';
export const secretJwt: string = 'p';
export const audienceJwt: string = 'hska.de';
export const expirationJwt: number = 1;  // Tage

// ----------------------------------------------------------
// m o n g o o s e
// ----------------------------------------------------------
export const mongoMock: boolean = false;

// In Produktion auf false setzen
export const autoIndex: boolean = true;

// http://mongoosejs.com/docs/connections.html
// https://github.com/mongodb/node-mongodb-native
// Defaultwerte
//      Port        27017
//      Poolsize    5
const dbUser: string = 'zimmermann';
const dbPassword: string = 'p';
const dbHost: string = 'localhost';
const dbName: string = 'buchdb';
const dbUrl: string = `mongodb://${dbUser}:${dbPassword}@${dbHost}/${dbName}`;

export let dbConn: Connection = null;
if (!mongoMock) {
    // Voraussetzung: Internet-Verbindung
    connect(dbUrl);
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
export const logOptions: any = {
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
