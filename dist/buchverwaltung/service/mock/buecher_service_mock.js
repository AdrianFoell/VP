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
const mongodb_1 = require('mongodb');
const buecher_mock_1 = require('./buecher_mock');
const shared_1 = require('../../../shared/shared');
/* tslint:disable:no-empty */
class BuchMock {
    // wird i.a. nicht direkt aufgerufen, sondern Buch.fromServer oder
    // Buch.fromForm
    constructor(_id, titel, rating, art, verlag, datum, preis, rabatt, lieferbar, schlagwoerter) {
        this._id = _id;
        this.titel = titel;
        this.rating = rating;
        this.art = art;
        this.verlag = verlag;
        this.datum = datum;
        this.preis = preis;
        this.rabatt = rabatt;
        this.lieferbar = lieferbar;
        this.schlagwoerter = schlagwoerter;
        this._id = _id || null;
        this.titel = titel || null;
        this.rating = rating || null;
        this.art = art || null;
        this.verlag = verlag || null;
        this.datum = datum || null;
        this.preis = preis || null;
        this.rabatt = rabatt || null;
        this.lieferbar = lieferbar || null;
        this.schlagwoerter =
            shared_1.isPresent(schlagwoerter) && schlagwoerter.length !== 0 ?
                schlagwoerter :
                [];
    }
    // JSON-Daten von einem REST-Client bei einem POST-oder PUT-Request
    static fromJson(buch) {
        return new BuchMock(buch._id, buch.titel, buch.rating, buch.art, buch.verlag, buch.datum, buch.preis, buch.rabatt, buch.lieferbar, buch.schlagwoerter);
    }
    // Dummy-Methoden fuer das Interface Document von mongoose
    equals(doc) { return false; }
    get(path, type) { return null; }
    inspect(options) { return null; }
    invalidate(path, error, value) { }
    isDirectModified(path) { return false; }
    isInit(path) { return false; }
    isModified(path) { return false; }
    isSelected(path) { return false; }
    markModified(path) { }
    modifiedPaths() { return null; }
    populate(p1, callback) {
        return null;
    }
    populated(path) { return null; }
    remove(callback) { return null; }
    save(callback) { return null; }
    set(p1, val, type, options) { }
    toJSON(options) { return null; }
    toObject(options) { return null; }
    toString() { return null; }
    update(doc, options, callback) {
        return null;
    }
    validate(cb) { }
}
exports.BuchMock = BuchMock;
class MockBuecherService {
    findById(id) {
        if (shared_1.isEmpty(id) || id.startsWith('F') || id.startsWith('f')) {
            return null;
        }
        buecher_mock_1.buchMock._id = new mongodb_1.ObjectID(id);
        const buch = BuchMock.fromJson(buecher_mock_1.buchMock);
        return Promise.resolve(buch);
    }
    find(query) {
        if (shared_1.isBlank(query)) {
            const buecher = buecher_mock_1.buecherMock.map((b) => BuchMock.fromJson(b));
            return Promise.resolve(buecher);
        }
        const { titel, art, rating, verlag, schnulze, scienceFiction } = query;
        let buecherJson = buecher_mock_1.buecherMock;
        if (!shared_1.isEmpty(titel)) {
            buecherJson = buecherJson.filter((buch) => buch.titel.toLowerCase().includes(titel.toLowerCase()));
        }
        if (!shared_1.isEmpty(art) && shared_1.isPresent(buecherJson)) {
            buecherJson =
                buecherJson.filter((buch) => buch.art === art);
        }
        if (shared_1.isPresent(rating) && shared_1.isPresent(buecherJson)) {
            buecherJson =
                buecherJson.filter((buch) => buch.rating === rating);
        }
        if (!shared_1.isEmpty(verlag) && shared_1.isPresent(buecherJson)) {
            buecherJson =
                buecherJson.filter((buch) => buch.verlag === verlag);
        }
        if (!shared_1.isEmpty(schnulze) && schnulze === 'true'
            && shared_1.isPresent(buecherJson)) {
            buecherJson = buecherJson.filter((buch) => buch.schlagwoerter.find((schlagwort) => schlagwort === 'SCHNULZE')
                !== undefined);
        }
        if (!shared_1.isEmpty(scienceFiction) && scienceFiction === 'true'
            && shared_1.isPresent(buecherJson)) {
            buecherJson = buecherJson.filter((buch) => buch.schlagwoerter.find((schlagwort) => schlagwort === 'SCIENCE_FICTION')
                !== undefined);
        }
        const buecher = shared_1.isPresent(buecherJson) ?
            buecherJson.map((b) => BuchMock.fromJson(b)) :
            [];
        return Promise.resolve(buecher);
    }
    save(buch) {
        buch._id = shared_1.generateMongoId().valueOf();
        return Promise.resolve(buch);
    }
    update(buch) { return Promise.resolve({}); }
    remove(id) { return Promise.resolve({}); }
    toString() { return 'MockBuecherService'; }
}
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [String]), 
    __metadata('design:returntype', Promise)
], MockBuecherService.prototype, "findById", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Promise)
], MockBuecherService.prototype, "find", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Promise)
], MockBuecherService.prototype, "save", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Promise)
], MockBuecherService.prototype, "update", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [String]), 
    __metadata('design:returntype', Promise)
], MockBuecherService.prototype, "remove", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MockBuecherService;
/* tslint:enable:no-empty */
