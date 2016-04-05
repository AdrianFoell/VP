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
const mongoose_1 = require('mongoose');
const shared_1 = require('../../shared/shared');
const userSchema = new mongoose_1.Schema({
    name: { type: String, index: true },
    pass: String,
    roles: [String],
});
// automat. Validierung der Indexe beim 1. Zugriff
userSchema.set('autoIndex', shared_1.autoIndex);
// fuer ein Document (-Objekt) die Methode toJSON bereitstellen
userSchema.set('toJSON', { getters: true, virtuals: false });
// Ein Model ist ein uebersetztes Schema und stellt die CRUD-Operationen fuer
// die Dokumente bereit, d.h. das Pattern "Active Record" wird realisiert.
exports.User = mongoose_1.model('User', userSchema);
