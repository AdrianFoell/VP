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
/* tslint:disable:max-line-length */
const mongoose_1 = require('mongoose');
const shared_1 = require('../../shared/shared');
/* tslint:enable:max-line-length */
// Eine Collection in MongoDB besteht aus Dokumenten im JSON-Format
// Ein Schema in Mongoose ist definiert die Struktur und Methoden fuer die
// Dokumente in einer Collection.
// Ein Schluessel im Schema definiert eine Property fuer jedes Dokument.
// Ein Schematyp (String, Number, Boolean, Date, Array, ObjectId) legt den Typ
// der Property fest.
// Im 2. Argument des Konstruktors wird der Name der Collection festgelegt.
// Der Default-Name der Collection ist der Plural zum Namen des Models (s.u.),
// d.h. die Collection haette den Namen "Videos".
const videoSchema = new mongoose_1.Schema({
    titel: { type: String, index: true },
    erscheinungsdatum: Date,
    beschreibung: String,
    altersbeschränkung: Number,
    videopfad: String,
    genre: String
}, { collection: 'videos' });
// automat. Validierung der Indexe beim 1. Zugriff
videoSchema.set('autoIndex', shared_1.AUTO_INDEX);
// fuer ein Document (-Objekt) die Methode toJSON bereitstellen
videoSchema.set('toJSON', { getters: true, virtuals: false });
const MODEL_NAME = 'Video';
// Methoden zum Schema hinzufuegen, damit sie spaeter beim Model (s.u.)
// verfuegbar sind, was aber bei buch.check() zu eines TS-Syntaxfehler fuehrt:
// buchSchema.methods.check = function(): any { ... }
function validateVideo(video) {
    'use strict';
    let invalid = false;
    let err = {};
    if (!video.isNew && !shared_1.isMongoId(video._id)) {
        err.id = 'Das Video hat eine ungueltige ID';
        invalid = true;
    }
    if (shared_1.isEmpty(video.titel)) {
        err.titel = 'Ein Video muss einen Titel haben';
        invalid = true;
    }
    if (!shared_1.isPresent(video.erscheinungsdatum)) {
        err.erscheinungsdatum = 'Ein Video benötigt ein Erscheinungsdatum';
        invalid = true;
    }
    if (!shared_1.isPresent(video.altersbeschränkung)) {
        err.altersbeschränkung =
            'Ein Video muss einen Altersbeschränkung besitzen';
        invalid = true;
    }
    if (shared_1.isEmpty(video.videopfad)) {
        err.videopfad = 'Ein Video muss eine Pfad besitzen';
        invalid = true;
    }
    if (shared_1.isEmpty(video.genre)) {
        err.genre = 'Ein Video muss einem Genre zugeordnet sein';
        invalid = true;
    }
    /*if (isPresent(video.kanal)) {
        err.kanal = 'Ein Video muss einem Kanal zugeordnet sein';
        invalid = true;
    }*/
    return invalid ? err : null;
}
exports.validateVideo = validateVideo;
;
// Ein Model ist ein uebersetztes Schema und stellt die CRUD-Operationen fuer
// die Dokumente bereit, d.h. das Pattern "Active Record" wird realisiert.
exports.Video = mongoose_1.model(MODEL_NAME, videoSchema);
