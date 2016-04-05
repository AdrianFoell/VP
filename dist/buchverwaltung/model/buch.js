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
// Eine Collection in MongoDB besteht aus Dokumenten im BSON-Format
// Ein Schema in Mongoose ist definiert die Struktur und Methoden fuer die
// Dokumente in einer Collection.
// Ein Schluessel im Schema definiert eine Property fuer jedes Dokument.
// Ein Schematyp (String, Number, Boolean, Date, Array, ObjectId) legt den Typ
// der Property fest.
// Im 2. Argument des Konstruktors wird der Name der Collection festgelegt.
// Der Default-Name der Collection ist der Plural zum Namen des Models (s.u.),
// d.h. die Collection haette den Namen "Buchs".
const buchSchema = new mongoose_1.Schema({
    titel: { type: String, index: true },
    art: String,
    rating: Number,
    verlag: String,
    datum: Date,
    preis: Number,
    rabatt: Number,
    lieferbar: Boolean,
    schlagwoerter: [String],
    autoren: [mongoose_1.Schema.Types.Mixed]
}, { collection: 'buecher' });
// automat. Validierung der Indexe beim 1. Zugriff
buchSchema.set('autoIndex', shared_1.autoIndex);
// fuer ein Document (-Objekt) die Methode toJSON bereitstellen
buchSchema.set('toJSON', { getters: true, virtuals: false });
const MODEL_NAME = 'Buch';
// Methoden zum Schema hinzufuegen, damit sie spaeter beim Model (s.u.)
// verfuegbar sind, was aber bei buch.check() zu eines TS-Syntaxfehler fuehrt:
// buchSchema.methods.check = function(): any { ... }
function validateBuch(buch) {
    'use strict';
    let invalid = false;
    let err = {};
    if (!buch.isNew && !shared_1.isMongoId(buch._id)) {
        err.id = 'Das Buch hat eine ungueltige ID';
        invalid = true;
    }
    if (shared_1.isEmpty(buch.titel)) {
        err.titel = 'Ein Buch muss einen Titel haben';
        invalid = true;
    }
    if (shared_1.isEmpty(buch.art)) {
        err.art = 'Die Art eines Buches muss gesetzt sein';
        invalid = true;
    }
    else if (buch.art !== 'KINDLE' && buch.art !== 'DRUCKAUSGABE') {
        err.art = 'Die Art eines Buches muss KINDLE oder DRUCKAUSGABE sein';
        invalid = true;
    }
    if (shared_1.isPresent(buch.rating)
        && (buch.rating < 0 || buch.rating > shared_1.MAX_RATING)) {
        err.rating = `${buch.rating} ist keine gueltige Bewertung`;
        invalid = true;
    }
    if (shared_1.isEmpty(buch.verlag)) {
        err.verlag = 'Der Verlag des Buches muss gesetzt sein';
        invalid = true;
    }
    else if (buch.verlag !== 'OREILLY' && buch.verlag !== 'PACKT') {
        err.verlag = 'Der Verlag eines Buches muss OREILLY oder PACKT sein';
        invalid = true;
    }
    return invalid ? err : null;
}
exports.validateBuch = validateBuch;
;
// buchSchema.statics.findByTitel = function(
//     titel: string, cb: Function): Array<mongoose.Document> {
//     return this.find({titel: titel}, cb);
// };
// Ein Model ist ein uebersetztes Schema und stellt die CRUD-Operationen fuer
// die Dokumente bereit, d.h. das Pattern "Active Record" wird realisiert.
exports.Buch = mongoose_1.model(MODEL_NAME, buchSchema);
