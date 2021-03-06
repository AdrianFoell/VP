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

// Document kann nicht direkt importiert werden, weil es in ES2015 auch eine
// Klasse Document gibt
import {Document as MDocument, Query} from 'mongoose';

import IVideosService from './ivideos_service';
import {Video} from '../model/video';
import {log, isBlank, isEmpty} from '../../shared/shared';

// API-Dokumentation zu mongoose:
// http://mongoosejs.com/docs/api.html

export default class VideosService implements IVideosService {
    // Status eines Promise:
    // Pending: das Resultat gibt es noch nicht, weil die asynchrone Operation,
    //          die das Resultat liefert, noch nicht abgeschlossen ist
    // Fulfilled: die asynchrone Operation ist abgeschlossen und
    //            das Promise-Objekt hat einen Wert
    // Rejected: die asynchrone Operation ist fehlgeschlagen and das
    //           Promise-Objekt wird nicht den Status "fulfilled" erreichen.
    //           Stattdessen ist im Promise-Objekt die Fehlerursache enthalten.

    @log
    findById(id: string): Promise<MDocument> {
        // ein Video zur gegebenen ID asynchron suchen
        return <Promise<MDocument>>Video.findById(id);
    }

    @log
    find(query?: any): Promise<Array<MDocument>> {
        // alle Videos asynchron suchen und aufsteigend nach titel sortieren
        // nach _id sortieren: Timestamp des INSERTs (Basis: Sek)
        // https://docs.mongodb.org/manual/reference/object-id
        if (isBlank(query) || Object.keys(query).length === 0) {
            const tmpQuery: Query<MDocument> = <Query<MDocument>>Video.find();
            return <Promise<Array<MDocument>>>tmpQuery.sort('titel');
        }

        // Videos zur Query (= JSON-Objekt durch Express) asynchron suchen
        let titelQuery: any = null;
        const titel: string = query.titel;
        if (!isEmpty(titel)) {
            // Titel in der Query: Teilstring des Titels,
            // d.h. "LIKE" als regulaerer Ausdruck
            // 'i': keine Unterscheidung zw. Gross- u. Kleinschreibung
            delete query.titel;
            titelQuery = {titel: new RegExp(titel, 'i')};
        }
        let genreQuery: any = null;
        const genre: string = query.genre;
        if (!isEmpty(genre)) {
            // Genre in der Query: Teilstring des Titels,
            // d.h. "LIKE" als regulaerer Ausdruck
            // 'i': keine Unterscheidung zw. Gross- u. Kleinschreibung
            delete query.genre;
            genreQuery = {genre: new RegExp(genre, 'i')};
        }
        if (titelQuery !== null && genreQuery !== null) {
            const tmpQuery: Query<MDocument> = <Query<MDocument>>Video.find();
            return <Promise<Array<MDocument>>>tmpQuery.and(
                [query, titelQuery, genreQuery]);
        }
        if (titelQuery !== null) {
            const tmpQuery: Query<MDocument> = <Query<MDocument>>Video.find();
            return <Promise<Array<MDocument>>>tmpQuery.and([query, titelQuery]);
        }
        if (genreQuery !== null) {
            const tmpQuery: Query<MDocument> = <Query<MDocument>>Video.find();
            return <Promise<Array<MDocument>>>(
                tmpQuery.and([query, genreQuery]));
        }
        return <Promise<Array<MDocument>>>(Video.find(query));
        // Videos.findOne(query), falls das Suchkriterium eindeutig ist
    }

    @log
    save(video: MDocument): Promise<MDocument> {
        // Das gegebene Video asynchron neu anlegen
        return video.save();
    }

    @log
    update(video: MDocument): Promise<{}> {
        // Das gegebene Video asynchron aktualisieren
        // __v wird nur erhoeht, durch find() und anschl. update()
        return <Promise<{}>>Video.findByIdAndUpdate(<string>video._id, video);

        // Weitere Methoden von mongoose fuer Aktualisieren:
        //    Video.findOneAndUpdate(bedingung, update)
        //    video.update(bedingung)
    }

    @log
    remove(id: string): Promise<{}> {
        // Das Video zur gegebenen ID asynchron loeschen
        return <Promise<{}>>Video.findByIdAndRemove(id);

        // Weitere Methoden von mongoose, um zu loeschen:
        //    Video.findOneAndRemove(bedingung)
        //    Video.remove(bedingung)
    }

    toString(): string { return 'VideosService'; }
}
