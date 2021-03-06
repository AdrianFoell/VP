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

import {Express} from 'express';
import * as express from 'express';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as morgan from 'morgan';
/* tslint:disable:no-var-requires */
const responseTime: any = require('response-time');
/* tslint:enable:no-var-requires */

import videosRouter from './videoverwaltung/router/index';
import loginRouter from './iam/router/index';
import {HOST, PORT, HTTPS_KEY, HTTPS_CERT, logger, log, logRequestHeader, responseTimeFn} from './shared/shared';

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
        // Express als Middleware = anwendungsneutrale Dienste-/Zwischenschicht,
        // d.h. Vermittler zwischen Request und Response.
        // Alternativen zu Express (hat die hoechsten Download-Zahlen):
        // * Hapi: von Walmart
        // * Restify
        // * Koa: von den urspruengl. Express-Entwicklern
        // * Sails: baut auf Express auf
        // * Kraken: baut auf Express auf
        //           von PayPal
        //           verwaltet von der Node.js Foundation

        // Das App- bzw. Express-Objekt ist zustaendig fuer:
        //  * Konfiguration der Middleware
        //  * Routing
        // http://expressjs.com/en/api.html
        const app: Express = express();

        if (process.env.NODE_ENV === 'development') {
            // Logging der eingehenden Requests in der Console
            app.use(morgan('dev'));
        } else {
            app.use(helmet.hidePoweredBy());
        }

        app.use(
               // Protokollierung der Response Time
               responseTime(responseTimeFn),
               // Protokollierung des eingehenden Request-Headers
               logRequestHeader,

               // CSP = Content Security Policy
               //   https://www.owasp.org/index.php/HTTP_Strict_Transport_Security
               //   https://tools.ietf.org/html/rfc7762
               helmet.csp({directives: {defaultSrc: ['https: \'self\'']}}),
               // XSS = Cross-site scripting attacks: Header X-XSS-Protection
               //   https://www.owasp.org/index.php/Cross-site_scripting
               helmet.xssFilter(),
               // Clickjacking
               //   https://www.owasp.org/index.php/Clickjacking
               //   http://tools.ietf.org/html/rfc7034
               helmet.frameguard(),
               // HSTS = HTTP Strict Transport Security:
               //   Header Strict-Transport-Security
               //   https://www.owasp.org/index.php/HTTP_Strict_Transport_Security
               //   https://tools.ietf.org/html/rfc6797
               helmet.hsts(),
               // MIME-sniffing: im Header X-Content-Type-Options
               //   https://blogs.msdn.microsoft.com/ie/2008/09/02/ie8-security-part-vi-beta-2-update
               //   http://msdn.microsoft.com/en-us/library/gg622941%28v=vs.85%29.aspx
               //   https://tools.ietf.org/html/rfc7034
               helmet.noSniff(),
               // Im Header "Cache-Control" and "Pragma" auf No Caching setzen
               helmet.noCache(),
               // HPKP = HTTP Public Key Pinning: im Header Public-Key-Pins
               //   https://www.owasp.org/index.php/Certificate_and_Public_Key_Pinning
               //   https://developer.mozilla.org/en-US/docs/Web/Security/Public_Key_Pinning
               //   https://tools.ietf.org/html/rfc7469
               helmet.publicKeyPins({
                   // 60 Tage in Sek.
                   maxAge: 60 * 24 * 60 * 60,
                   sha256s: [
                       '4pBbUlCXuWGDP0rkk1P8hxQlHTc6kFlBjCIofCbAZ4w=',
                       'IrlsJtgPtWm8H5FaQB8PeeZ5VQH3Z0oamMQoFsGQ5Bc='
                   ]
               }),
               // CORS = Cross Origin Resource Sharing
               //   http://www.html5rocks.com/en/tutorials/cors
               //   https://www.w3.org/TR/cors
               cors({
                   origin: 'https://localhost',
                   credentials: true,
                   // nachfolgende Optionen nur fuer OPTIONS:
                   methods: 'GET,HEAD,POST,PUT,DELETE',
                   allowedHeaders:
                       'origin,content-type,accept,authorization,access-control-allow-origin,access-control-allow-methods,access-control-allow-headers,allow,content-length,date,last-modified,if-modified-since',
                   maxAge: 86400
               }),
               // GZIP-Komprimierung:
               // Chrome (und damit auch Postman) sendet implizit
               //   Accept-Encoding: gzip
               compression())

            // Router sind eine "Mini-Anwendung" mit Express
            .use('/videos', videosRouter)
            .use('/login', loginRouter);

        return app;
    }
}

new Server(HOST, process.env.PORT || PORT, HTTPS_KEY, HTTPS_CERT).start();
/* tslint:enable:max-line-length */
