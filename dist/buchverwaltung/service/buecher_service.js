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
const buch_1 = require('../model/buch');
const shared_1 = require('../../shared/shared');
// API-Dokumentation zu mongoose:
// http://mongoosejs.com/docs/api.html
class BuecherService {
    // Status eines Promise:
    // Pending: das Resultat gibt es noch nicht, weil die asynchrone Operation,
    //          die das Resultat liefert, noch nicht abgeschlossen ist
    // Fulfilled: die asynchrone Operation ist abgeschlossen und
    //            das Promise-Objekt hat einen Wert
    // Rejected: die asynchrone Operation ist fehlgeschlagen and das
    //           Promise-Objekt wird nicht den Status "fulfilled" erreichen.
    //           Stattdessen ist im Promise-Objekt die Fehlerursache enthalten.
    findById(id) {
        // ein Buch zur gegebenen ID asynchron suchen
        return buch_1.Buch.findById(id);
    }
    find(query) {
        // alle Buecher asynchron suchen und aufsteigend nach titel sortieren
        // nach _id sortieren: Timestamp des INSERTs (Basis: Sek)
        // https://docs.mongodb.org/manual/reference/object-id
        if (shared_1.isBlank(query) || Object.keys(query).length === 0) {
            const tmpQuery = buch_1.Buch.find();
            return tmpQuery.sort('titel');
        }
        // Buecher zur Query (= JSON-Objekt durch Express) asynchron suchen
        let titelQuery = null;
        const titel = query.titel;
        if (!shared_1.isEmpty(titel)) {
            // Titel in der Query: Teilstring des Titels,
            // d.h. "LIKE" als regulaerer Ausdruck
            // 'i': keine Unterscheidung zw. Gross- u. Kleinschreibung
            delete query.titel;
            titelQuery = { titel: new RegExp(titel, 'i') };
        }
        // z.B. {schnulze: true, scienceFiction: true}
        let schnulzeQuery = null;
        if (query.schnulze === 'true') {
            delete query.schnulze;
            schnulzeQuery = { schlagwoerter: 'SCHNULZE' };
        }
        let scienceFictionQuery = null;
        if (query.scienceFiction === 'true') {
            delete query.scienceFiction;
            scienceFictionQuery = { schlagwoerter: 'SCIENCE_FICTION' };
        }
        let schlagwoerterQuery = null;
        if (schnulzeQuery !== null && scienceFictionQuery !== null) {
            schlagwoerterQuery = {
                schlagwoerter: ['SCHNULZE', 'SCIENCE_FICTION']
            };
        }
        else if (schnulzeQuery !== null) {
            schlagwoerterQuery = schnulzeQuery;
        }
        else if (scienceFictionQuery !== null) {
            schlagwoerterQuery = scienceFictionQuery;
        }
        if (titelQuery !== null && schlagwoerterQuery !== null) {
            const tmpQuery = buch_1.Buch.find();
            return tmpQuery.and([query, titelQuery, schlagwoerterQuery]);
        }
        if (titelQuery !== null) {
            const tmpQuery = buch_1.Buch.find();
            return tmpQuery.and([query, titelQuery]);
        }
        if (schlagwoerterQuery !== null) {
            const tmpQuery = buch_1.Buch.find();
            return (tmpQuery.and([query, schlagwoerterQuery]));
        }
        return (buch_1.Buch.find(query));
        // Buch.findOne(query), falls das Suchkriterium eindeutig ist
    }
    save(buch) {
        // Das gegebene Buch asynchron neu anlegen
        return buch.save();
    }
    update(buch) {
        // Das gegebene Buch asynchron aktualisieren
        // __v wird nur erhoeht, durch find() und anschl. update()
        return buch_1.Buch.findByIdAndUpdate(buch._id, buch);
        // Weitere Methoden von mongoose fuer Aktualisieren:
        //    Buch.findOneAndUpdate(bedingung, update)
        //    buch.update(bedingung)
    }
    remove(id) {
        // Das Buch zur gegebenen ID asynchron loeschen
        return buch_1.Buch.findByIdAndRemove(id);
        // Weitere Methoden von mongoose, um zu loeschen:
        //    Buch.findOneAndRemove(bedingung)
        //    Buch.remove(bedingung)
    }
    toString() { return 'BuecherService'; }
}
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [String]), 
    __metadata('design:returntype', Promise)
], BuecherService.prototype, "findById", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Promise)
], BuecherService.prototype, "find", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Promise)
], BuecherService.prototype, "save", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', Promise)
], BuecherService.prototype, "update", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [String]), 
    __metadata('design:returntype', Promise)
], BuecherService.prototype, "remove", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BuecherService;
