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
import {ObjectID} from 'mongodb';
import {Document as MDocument, Query, PopulateOption} from 'mongoose';

import IKanaeleService from '../ikanaele_service';
import {kanalMock, kanaeleMock} from './kanaele_mock';
import {log, isEmpty, isBlank, isPresent, generateMongoId} from '../../../shared/shared';
/* tslint:enable:max-line-length */

export interface IKanal {
    _id?: string|ObjectID;
    name: string;
    beschreibung: string;
}

/* tslint:disable:no-empty */
export class KanalMock implements MDocument, IKanal {
    // Properties fuer das Interface Document von mongoose
    isNew: boolean;
    errors: Object;
    schema: Object;

    // wird i.a. nicht direkt aufgerufen, sondern Buch.fromServer oder
    // Buch.fromForm
    constructor(
        public _id: string, public name: string, public beschreibung: string) {
        this._id = _id || null;
        this.name = name || null;
    }

    // JSON-Daten von einem REST-Client bei einem POST-oder PUT-Request
    static fromJson(kanal: IKanal): KanalMock {
        return new KanalMock(
            <string>kanal._id, kanal.name, kanal.beschreibung);
    }

    // Dummy-Methoden fuer das Interface Document von mongoose
    equals(doc: MDocument): boolean { return false; }
    get(path: string, type?: new (...args: any[]) => any): any { return null; }
    inspect(options?: Object): string { return null; }
    invalidate(path: string, errorMsg: string, value: any): void;
    invalidate(path: string, error: Error, value: any): void;
    invalidate(path: string, error: string|Error, value: any): void {}
    isDirectModified(path: string): boolean { return false; }
    isInit(path: string): boolean { return false; }
    isModified(path?: string): boolean { return false; }
    isSelected(path: string): boolean { return false; }
    markModified(path: string): void {}
    modifiedPaths(): string[] { return null; }
    populate<T>(callback?: (err: any, res: T) => void): MDocument;
    populate<T>(path: string, callback?: (err: any, res: T) => void): MDocument;
    populate<T>(opt: PopulateOption, callback?: (err: any, res: T) => void):
        MDocument;
    populate<T>(
        p1: ((err: any, res: T) => void)|string|PopulateOption,
        callback?: (err: any, res: T) => void): MDocument {
        return null;
    }
    populated(path: string): any { return null; }
    remove<T>(callback?: (err: any) => void): Query<T> { return null; }
    save<T>(callback?: (err: any, res: T) => void): Promise<T> { return null; }
    set(path: string, val: any, type?: new (...args: any[]) => any,
        options?: Object): void;
    set(path: string, val: any, options?: Object): void;
    set(value: Object): void;
    set(p1: string|Object, val?: any, type?: new (...args: any[]) => any,
        options?: Object): void {}
    toJSON(options?: Object): Object { return null; }
    toObject(options?: Object): Object { return null; }
    toString(): string { return null; }
    update<T>(
        doc: Object, options: Object,
        callback: (err: any, affectedRows: number, raw: any) => void):
        Query<T> {
        return null;
    }
    validate(cb: (err: any) => void): void {}
}

export default class MockKanaeleService implements IKanaeleService {
    @log
    findById(id: string): Promise<MDocument> {
        if (isEmpty(id) || id.startsWith('F') || id.startsWith('f')) {
            return null;
        }
        kanalMock._id = new ObjectID(id);
        const kanal: MDocument = KanalMock.fromJson(kanalMock);
        return Promise.resolve(kanal);
    }

    @log
    find(query?: any): Promise<Array<MDocument>> {
        if (isBlank(query)) {
            const kanaele: Array<MDocument> =
                kanaeleMock.map((b: IKanal) => KanalMock.fromJson(b));
            return Promise.resolve(kanaele);
        }

        const {name, beschreibung}: any =
            query;

        let kanaeleJson: Array<IKanal> = kanaeleMock;
        if (!isEmpty(name)) {
            kanaeleJson = kanaeleJson.filter(
                (kanal: KanalMock) =>
                    kanal.name.toLowerCase().includes(name.toLowerCase()));
        }
        if (isPresent(beschreibung) && isPresent(kanaeleJson)) {
            kanaeleJson =
                kanaeleJson.filter((kanal: KanalMock) =>
                kanal.beschreibung === beschreibung);
        }

        const kanaele: Array<KanalMock> = isPresent(kanaeleJson) ?
            kanaeleJson.map((b: IKanal) => KanalMock.fromJson(b)) :
            [];
        return Promise.resolve(kanaele);
    }

    @log
    save(kanal: any): Promise<MDocument> {
        kanal._id = <string>generateMongoId().valueOf();
        return Promise.resolve(kanal);
    }

    @log
    update(kanal: any): Promise<{}> { return Promise.resolve({}); }

    @log
    remove(id: string): Promise<{}> { return Promise.resolve({}); }

    toString(): string { return 'MockKanaeleService'; }
}
/* tslint:enable:no-empty */
