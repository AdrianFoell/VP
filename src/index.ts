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

// https://nodejs.org/api/https.html
// Express funktioniert nicht mit HTTP/2:
// https://github.com/molnarg/node-http2/issues/100
import {createServer} from 'https';

// Express als Middleware (= anwendungsneutrale Dienste- bzw. Zwischenschicht),
// d.h. Vermittler zwischen Request und Response.
// http://expressjs.com/4x/api.html
// Alternativen zu Express (hat mind. 25x Download-Zahlen):
// * Hapi: von Walmart
// * Restify
// * Koa: von den urspruengl. Express-Entwicklern
// * Sails: baut auf Express auf
// * Kraken: baut auf Express auf
//           von PayPal
//           verwaltet von der Node.js Foundation
import {Express} from 'express';
// express exportiert das Modul e und die gleichnamige Function
import * as express from 'express';

// GZIP-Komprimierung: Chrome (und damit auch Postman) sendet implizit
// Accept-Encoding: gzip
// compression exportiert das Modul e und die gleichnamige Function
import * as compression from 'compression';

// Content Security Policy (CSP)
//  https://www.owasp.org/index.php/HTTP_Strict_Transport_Security
//  https://github.com/helmetjs/helmet/issues/117
// Cross-site scripting attacks (XSS)
//  https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
// Clickjacking
//  http://tools.ietf.org/html/draft-ietf-websec-x-frame-options-01
//  https://www.owasp.org/index.php/Clickjacking
// HTTP Strict Transport Security (HSTS)
//  https://www.owasp.org/index.php/HTTP_Strict_Transport_Security
// MIME-sniffing
//  https://blogs.msdn.microsoft.com/ie/2008/09/02/ie8-security-part-vi-beta-2-update
//  http://msdn.microsoft.com/en-us/library/gg622941%28v=vs.85%29.aspx
// No cache
import * as helmet from 'helmet';

// CORS = Cross Origin Resource Sharing
// http://www.html5rocks.com/en/tutorials/cors
import * as cors from 'cors';

// Logging der eingehenden Requests in der Console
import * as morgan from 'morgan';

// response-time exportiert das Modul responseTime und die gleichnamige Function
// import * as responseTime from 'response-time';
/* tslint:disable:no-var-requires */
const responseTime: any = require('response-time');
/* tslint:enable:no-var-requires */

import videosRouter from './videoverwaltung/router/index';
import kanaeleRouter from './kanalverwaltung/router/index';
import loginRouter from './iam/router/index';
import {host, port, httpsKey, httpsCert, logger, log, logRequestHeader, responseTimeFn} from './shared/shared';
/* tslint:enable:max-line-length */

class Server {
    private _app: Express = this._initApp();

    constructor(
        private _host: string, private _port: number, private _httpsKey: Buffer,
        private _httpsCert: Buffer) {}

    @log
    start(): void {
        createServer({key: this._httpsKey, cert: this._httpsCert}, this._app)
            .listen(this._port, this._host, () => {
                logger.info(
                    `Der Server ist gestartet: https://${this._host}:${this._port}`);
            });
    }

    toString(): string { return 'Server'; }

    private _initApp(): Express {
        // Das App- bzw. Express-Objekt ist zustaendig fuer:
        //  * Konfiguration der Middleware
        //  * Routing
        // http://expressjs.com/en/api.html
        const app: Express = express();

        if (process.env.NODE_ENV === 'development') {
            app.use(morgan('dev'));
        } else {
            app.use(helmet.hidePoweredBy());
        }

        app.use(
               responseTime(responseTimeFn), logRequestHeader,

               // helmet(),
               helmet.csp({directives: {defaultSrc: ['https: \'self\'']}}),
               helmet.xssFilter(), helmet.frameguard(), helmet.hsts(),
               helmet.noSniff(), helmet.noCache(), cors({
                   origin: 'https://localhost',
                   credentials: true,
                   // nachfolgende Optionen nur fuer OPTIONS:
                   methods: 'GET,HEAD,POST,PUT,DELETE',
                   /* tslint:disable:max-line-length */
                   allowedHeaders:
                       'origin,content-type,accept,authorization,access-control-allow-origin,access-control-allow-methods,access-control-allow-headers,allow,content-length,date,last-modified,if-modified-since',
                   /* tslint:enable:max-line-length */
                   maxAge: 86400
               }),
               compression())

            // Router sind eine "Mini-Anwendung" mit Express
            .use('/videos', videosRouter)
            .use('/kanaele', kanaeleRouter)
            .use('/login', loginRouter);

        return app;
    }
}

new Server(host, process.env.PORT || port, httpsKey, httpsCert).start();
