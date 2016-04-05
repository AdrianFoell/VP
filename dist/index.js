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
/* tslint:disable:max-line-length */
// https://nodejs.org/api/https.html
// Express funktioniert nicht mit HTTP/2:
// https://github.com/molnarg/node-http2/issues/100
const https_1 = require('https');
// express exportiert das Modul e und die gleichnamige Function
const express = require('express');
// GZIP-Komprimierung: Chrome (und damit auch Postman) sendet implizit
// Accept-Encoding: gzip
// compression exportiert das Modul e und die gleichnamige Function
const compression = require('compression');
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
const helmet = require('helmet');
// CORS = Cross Origin Resource Sharing
// http://www.html5rocks.com/en/tutorials/cors
const cors = require('cors');
// Logging der eingehenden Requests in der Console
const morgan = require('morgan');
// response-time exportiert das Modul responseTime und die gleichnamige Function
// import * as responseTime from 'response-time';
/* tslint:disable:no-var-requires */
const responseTime = require('response-time');
/* tslint:enable:no-var-requires */
const index_1 = require('./buchverwaltung/router/index');
const index_2 = require('./verlagverwaltung/router/index');
const index_3 = require('./iam/router/index');
const shared_1 = require('./shared/shared');
/* tslint:enable:max-line-length */
class Server {
    constructor(_host, _port, _httpsKey, _httpsCert) {
        this._host = _host;
        this._port = _port;
        this._httpsKey = _httpsKey;
        this._httpsCert = _httpsCert;
        this._app = this._initApp();
    }
    start() {
        https_1.createServer({ key: this._httpsKey, cert: this._httpsCert }, this._app)
            .listen(this._port, this._host, () => {
            shared_1.logger.info(`Der Server ist gestartet: https://${this._host}:${this._port}`);
        });
    }
    toString() { return 'Server'; }
    _initApp() {
        // Das App- bzw. Express-Objekt ist zustaendig fuer:
        //  * Konfiguration der Middleware
        //  * Routing
        // http://expressjs.com/en/api.html
        const app = express();
        if (process.env.NODE_ENV === 'development') {
            app.use(morgan('dev'));
        }
        else {
            app.use(helmet.hidePoweredBy());
        }
        app.use(responseTime(shared_1.responseTimeFn), shared_1.logRequestHeader, 
        // helmet(),
        helmet.csp({ directives: { defaultSrc: ['https: \'self\''] } }), helmet.xssFilter(), helmet.frameguard(), helmet.hsts(), helmet.noSniff(), helmet.noCache(), cors({
            origin: 'https://localhost',
            credentials: true,
            // nachfolgende Optionen nur fuer OPTIONS:
            methods: 'GET,HEAD,POST,PUT,DELETE',
            /* tslint:disable:max-line-length */
            allowedHeaders: 'origin,content-type,accept,authorization,access-control-allow-origin,access-control-allow-methods,access-control-allow-headers,allow,content-length,date,last-modified,if-modified-since',
            /* tslint:enable:max-line-length */
            maxAge: 86400
        }), compression())
            .use('/buecher', index_1.default)
            .use('/verlage', index_2.default)
            .use('/login', index_3.default);
        return app;
    }
}
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', []), 
    __metadata('design:returntype', void 0)
], Server.prototype, "start", null);
new Server(shared_1.host, process.env.PORT || shared_1.port, shared_1.httpsKey, shared_1.httpsCert).start();
