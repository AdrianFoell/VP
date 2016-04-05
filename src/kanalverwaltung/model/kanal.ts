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
import {Schema, Model, model, Document as MDocument} from 'mongoose';
import {autoIndex, isMongoId} from '../../shared/shared';
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
const kanalSchema: Schema = new Schema(
    {
      name: {type: String, index: true},
      beschreibung: String,
    },
    {collection: 'kanaele'});

// automat. Validierung der Indexe beim 1. Zugriff
kanalSchema.set('autoIndex', autoIndex);

// fuer ein Document (-Objekt) die Methode toJSON bereitstellen
kanalSchema.set('toJSON', {getters: true, virtuals: false});

const MODEL_NAME: string = 'Kanal';

// Methoden zum Schema hinzufuegen, damit sie spaeter beim Model (s.u.)
// verfuegbar sind, was aber bei buch.check() zu eines TS-Syntaxfehler fuehrt:
// buchSchema.methods.check = function(): any { ... }

export function validateKanal(kanal: any): any {
    'use strict';

    let invalid: boolean = false;
    let err: any = {};

    if (!kanal.isNew && !isMongoId(kanal._id)) {
        err.id = 'Der Kanal hat eine ungueltige ID';
        invalid = true;
    }

    return invalid ? err : null;
};

// buchSchema.statics.findByTitel = function(
//     titel: string, cb: Function): Array<mongoose.Document> {
//     return this.find({titel: titel}, cb);
// };

// Ein Model ist ein uebersetztes Schema und stellt die CRUD-Operationen fuer
// die Dokumente bereit, d.h. das Pattern "Active Record" wird realisiert.
export const Kanal: Model<MDocument> = model(MODEL_NAME, kanalSchema);
