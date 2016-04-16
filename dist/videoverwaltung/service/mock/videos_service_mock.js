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
const videos_mock_1 = require('./videos_mock');
const shared_1 = require('../../../shared/shared');
/* tslint:disable:no-empty */
class VideoMock {
    // wird i.a. nicht direkt aufgerufen, sondern Buch.fromServer oder
    // Buch.fromForm
    constructor(_id, titel, erscheinungsdatum, beschreibung, altersbeschränkung, videopfad, genre) {
        this._id = _id;
        this.titel = titel;
        this.erscheinungsdatum = erscheinungsdatum;
        this.beschreibung = beschreibung;
        this.altersbeschränkung = altersbeschränkung;
        this.videopfad = videopfad;
        this.genre = genre;
        this._id = _id || null;
        this.titel = titel || null;
        this.erscheinungsdatum = erscheinungsdatum || null;
        this.beschreibung = beschreibung || null;
        this.videopfad = videopfad || null;
        this.genre = genre || null;
    }
    // JSON-Daten von einem REST-Client bei einem POST-oder PUT-Request
    static fromJson(video) {
        return new VideoMock(video._id, video.titel, video.erscheinungsdatum, video.beschreibung, video.altersbeschränkung, video.videopfad, video.genre);
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
exports.VideoMock = VideoMock;
class MockVideosService {
    findById(id) {
        if (shared_1.isEmpty(id) || id.startsWith('F') || id.startsWith('f')) {
            return null;
        }
        videos_mock_1.videoMock._id = new mongodb_1.ObjectID(id);
        const video = VideoMock.fromJson(videos_mock_1.videoMock);
        return Promise.resolve(video);
    }
    find(query) {
        if (shared_1.isBlank(query)) {
            const videos = videos_mock_1.videosMock.map((v) => VideoMock.fromJson(v));
            return Promise.resolve(videos);
        }
        const { titel, erscheinungsdatum, beschreibung, altersbeschränkung, videopfad, genre } = query;
        let videosJson = videos_mock_1.videosMock;
        if (!shared_1.isEmpty(titel)) {
            videosJson = videosJson.filter((video) => video.titel.toLowerCase().includes(titel.toLowerCase()));
        }
        if (shared_1.isPresent(erscheinungsdatum) && shared_1.isPresent(videosJson)) {
            videosJson = videosJson.filter((video) => video.erscheinungsdatum === erscheinungsdatum);
        }
        if (!shared_1.isEmpty(beschreibung) && shared_1.isPresent(videosJson)) {
            videosJson = videosJson.filter((video) => video.beschreibung === beschreibung);
        }
        if (shared_1.isPresent(altersbeschränkung) && shared_1.isPresent(videosJson)) {
            videosJson = videosJson.filter((video) => video.altersbeschränkung === altersbeschränkung);
        }
        if (!shared_1.isEmpty(genre) && shared_1.isPresent(videosJson)) {
            videosJson = videosJson.filter((video) => video.videopfad === videopfad);
        }
        if (!shared_1.isEmpty(genre) && shared_1.isPresent(videosJson)) {
            videosJson =
                videosJson.filter((video) => video.genre === genre);
        }
        const videos = shared_1.isPresent(videosJson) ?
            videosJson.map((b) => VideoMock.fromJson(b)) :
            [];
        return Promise.resolve(videos);
    }
    save(video) {
        video._id = shared_1.generateMongoId().valueOf();
        return Promise.resolve(video);
    }
    update(video) { return Promise.resolve({}); }
    remove(id) { return Promise.resolve({}); }
    toString() { return 'MockVideosService'; }
}
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [String]), 
    __metadata('design:returntype', Promise)
], MockVideosService.prototype, "findById", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Promise)
], MockVideosService.prototype, "find", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Promise)
], MockVideosService.prototype, "save", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Promise)
], MockVideosService.prototype, "update", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [String]), 
    __metadata('design:returntype', Promise)
], MockVideosService.prototype, "remove", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MockVideosService;
/* tslint:enable:no-empty */
