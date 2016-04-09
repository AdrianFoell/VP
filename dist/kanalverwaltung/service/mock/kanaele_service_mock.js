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
const kanaele_mock_1 = require('./kanaele_mock');
const shared_1 = require('../../../shared/shared');
/* tslint:disable:no-empty */
class KanalMock {
    // wird i.a. nicht direkt aufgerufen, sondern Buch.fromServer oder
    // Buch.fromForm
    constructor(_id, name, beschreibung) {
        this._id = _id;
        this.name = name;
        this.beschreibung = beschreibung;
        this._id = _id || null;
        this.name = name || null;
    }
    // JSON-Daten von einem REST-Client bei einem POST-oder PUT-Request
    static fromJson(kanal) {
        return new KanalMock(kanal._id, kanal.name, kanal.beschreibung);
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
exports.KanalMock = KanalMock;
class MockKanaeleService {
    findById(id) {
        if (shared_1.isEmpty(id) || id.startsWith('F') || id.startsWith('f')) {
            return null;
        }
        kanaele_mock_1.kanalMock._id = new mongodb_1.ObjectID(id);
        const kanal = KanalMock.fromJson(kanaele_mock_1.kanalMock);
        return Promise.resolve(kanal);
    }
    find(query) {
        if (shared_1.isBlank(query)) {
            const kanaele = kanaele_mock_1.kanaeleMock.map((b) => KanalMock.fromJson(b));
            return Promise.resolve(kanaele);
        }
        const { name, beschreibung } = query;
        let kanaeleJson = kanaele_mock_1.kanaeleMock;
        if (!shared_1.isEmpty(name)) {
            kanaeleJson = kanaeleJson.filter((kanal) => kanal.name.toLowerCase().includes(name.toLowerCase()));
        }
        if (shared_1.isPresent(beschreibung) && shared_1.isPresent(kanaeleJson)) {
            kanaeleJson = kanaeleJson.filter((kanal) => kanal.beschreibung === beschreibung);
        }
        const kanaele = shared_1.isPresent(kanaeleJson) ?
            kanaeleJson.map((b) => KanalMock.fromJson(b)) :
            [];
        return Promise.resolve(kanaele);
    }
    save(kanal) {
        kanal._id = shared_1.generateMongoId().valueOf();
        return Promise.resolve(kanal);
    }
    update(kanal) { return Promise.resolve({}); }
    remove(id) { return Promise.resolve({}); }
    toString() { return 'MockKanaeleService'; }
}
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [String]), 
    __metadata('design:returntype', Promise)
], MockKanaeleService.prototype, "findById", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Promise)
], MockKanaeleService.prototype, "find", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Promise)
], MockKanaeleService.prototype, "save", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Promise)
], MockKanaeleService.prototype, "update", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [String]), 
    __metadata('design:returntype', Promise)
], MockKanaeleService.prototype, "remove", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MockKanaeleService;
/* tslint:enable:no-empty */
