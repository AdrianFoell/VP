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
const validator_1 = require('validator');
const shared_1 = require('./shared');
class SharedRequestHandler {
    logRequestHeader(req, res, next) {
        shared_1.logger.debug(`Request: headers=${JSON.stringify(req.headers, null, 2)}`);
        shared_1.logger.debug(`Request: protocol=${JSON.stringify(req.protocol, null, 2)}`);
        shared_1.logger.debug(`Request: hostname=${JSON.stringify(req.hostname, null, 2)}`);
        if (req.body !== undefined) {
            shared_1.logger.debug(`Request: body=${JSON.stringify(req.body, null, 2)}`);
        }
        Object.keys(req).forEach((key) => {
            if (req.hasOwnProperty(key)) {
                shared_1.logger.log('silly', `Request-Key: ${key}`);
            }
        });
        // Request-Verarbeitung fortsetzen
        next();
    }
    /* tslint:disable:max-line-length */
    addSecurityHeader(req, res, next) {
        // HSTS = HTTP Strict Transport Security
        // https://www.owasp.org/index.php/HTTP_Strict_Transport_Security
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        // CORS = Cross Origin Resource Sharing
        // http://www.html5rocks.com/en/tutorials/cors
        res.setHeader('Access-Control-Allow-Origin', 'https://localhost');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE, HEAD');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, authorization, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers, allow, content-length, date, last-modified, if-modified-since');
        res.setHeader('Access-Control-Max-Age', '1728000');
        // CSP = Content Security Policy
        // http://www.html5rocks.com/en/tutorials/security/content-security-policy
        res.setHeader('Content-Security-Policy', 'default-src https:; script-src https: \'self\'; img-src https: \'self\'; media-src https: \'self\'');
        // XSS = Cross Site Scripting
        // https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
        res.setHeader('X-XSS-Protection', '1; mode=block');
        // Clickjacking
        // http://tools.ietf.org/html/draft-ietf-websec-x-frame-options-01
        // https://www.owasp.org/index.php/Clickjacking
        res.setHeader('X-Frame-Options', 'deny');
        // MIME-sniffing
        // https://blogs.msdn.microsoft.com/ie/2008/09/02/ie8-security-part-vi-beta-2-update
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Cache-Control', 'private,no-cache,no-store,max-age=0,no-transform');
        res.setHeader('Expires', '-1');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('X-Provided-By', 'Juergen Zimmermann');
        // Request-Verarbeitung fortsetzen
        next();
    }
    /* tslint:enable:max-line-length */
    validateMongoId(req, res, next, id) {
        shared_1.logger.debug(`id = ${id}`);
        if (!shared_1.isMongoId(id)) {
            shared_1.logger.debug('status = 400');
            res.status(400).send(`${id} ist keine gueltige Buch-ID`);
        }
        next();
    }
    validateUUID(req, res, next, id) {
        if (!validator_1.isUUID(id)) {
            shared_1.logger.debug('status = 400');
            res.status(400).send(`${id} ist keine gueltige Buch-ID`);
            return;
        }
        next();
    }
    notYetImplemented(req, res) {
        res.sendStatus(501);
    }
    toString() { return 'SharedRequestHandler'; }
}
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object, Function]), 
    __metadata('design:returntype', void 0)
], SharedRequestHandler.prototype, "logRequestHeader", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object, Function]), 
    __metadata('design:returntype', void 0)
], SharedRequestHandler.prototype, "addSecurityHeader", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object, Function, Object]), 
    __metadata('design:returntype', void 0)
], SharedRequestHandler.prototype, "validateMongoId", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object, Function, Object]), 
    __metadata('design:returntype', void 0)
], SharedRequestHandler.prototype, "validateUUID", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object]), 
    __metadata('design:returntype', void 0)
], SharedRequestHandler.prototype, "notYetImplemented", null);
// -----------------------------------------------------------------------
// E x p o r t i e r t e   F u n c t i o n s
// -----------------------------------------------------------------------
function logRequestHeader(req, res, next) {
    'use strict';
    new SharedRequestHandler().logRequestHeader(req, res, next);
}
exports.logRequestHeader = logRequestHeader;
function addSecurityHeader(req, res, next) {
    'use strict';
    new SharedRequestHandler().addSecurityHeader(req, res, next);
}
exports.addSecurityHeader = addSecurityHeader;
function validateMongoId(req, res, next, id) {
    'use strict';
    new SharedRequestHandler().validateMongoId(req, res, next, id);
}
exports.validateMongoId = validateMongoId;
function validateUUID(req, res, next, id) {
    'use strict';
    new SharedRequestHandler().validateUUID(req, res, next, id);
}
exports.validateUUID = validateUUID;
function notYetImplemented(req, res) {
    'use strict';
    new SharedRequestHandler().notYetImplemented(req, res);
}
exports.notYetImplemented = notYetImplemented;
