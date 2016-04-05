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

import IVideosService from '../ivideos_service';
import {videoMock, videosMock} from './videos_mock';
import {log, isEmpty, isBlank, isPresent, generateMongoId} from '../../../shared/shared';
/* tslint:enable:max-line-length */

export interface IGenre {
    _id?: string|ObjectID;
    name: string;
}

export interface IKanal {
    _id?: string|ObjectID;
    name: string;
    beschreibung: string;
}

export interface IVideo {
    _id?: string|ObjectID;
    titel: string;
    erscheinungsdatum: string;
    beschreibung: string;
    altersbeschränkung: number;
    videopfad: string;
    genre?: Array<IGenre>;
    kanal?: IKanal;
 }

/* tslint:disable:no-empty */
export class VideoMock implements MDocument, IVideo {
    // Properties fuer das Interface Document von mongoose
    isNew: boolean;
    errors: Object;
    schema: Object;

    // wird i.a. nicht direkt aufgerufen, sondern Buch.fromServer oder
    // Buch.fromForm
    constructor(
        public _id: string, public titel: string, public erscheinungsdatum: string,
        public beschreibung: string, public altersbeschränkung: number,
        public videopfad: string) {
        this._id = _id || null;
        this.titel = titel || null;
        this.erscheinungsdatum = erscheinungsdatum || null;
        this.beschreibung = beschreibung || null;
        this.videopfad = videopfad || null;
    }

    // JSON-Daten von einem REST-Client bei einem POST-oder PUT-Request
    static fromJson(video: IVideo): VideoMock {
        return new VideoMock(
            <string>video._id, video.titel, video.erscheinungsdatum,
            video.beschreibung, video.altersbeschränkung, video.videopfad);
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

export default class MockVideosService implements IVideosService {
    @log
    findById(id: string): Promise<MDocument> {
        if (isEmpty(id) || id.startsWith('F') || id.startsWith('f')) {
            return null;
        }
        videoMock._id = new ObjectID(id);
        const video: MDocument = VideoMock.fromJson(videoMock);
        return Promise.resolve(video);
    }

    @log
    find(query?: any): Promise<Array<MDocument>> {
        if (isBlank(query)) {
            const videos: Array<MDocument> =
                videosMock.map((b: IVideo) => VideoMock.fromJson(b));
            return Promise.resolve(videos);
        }

        const {titel, erscheinungsdatum, beschreibung,
               altersbeschränkung, videopfad}: any =
            query;

        let videosJson: Array<IVideo> = videosMock;
        if (!isEmpty(titel)) {
            videosJson = videosJson.filter(
                (video: VideoMock) =>
                    video.titel.toLowerCase().includes(titel.toLowerCase()));
        }
        if (!isEmpty(erscheinungsdatum) && isPresent(videosJson)) {
            videosJson =
                videosJson.filter((video: VideoMock) =>
                video.erscheinungsdatum === erscheinungsdatum);
        }
        if (isPresent(beschreibung) && isPresent(videosJson)) {
            videosJson =
                videosJson.filter((video: VideoMock) =>
                video.beschreibung === beschreibung);
        }
        if (!isEmpty(altersbeschränkung) && isPresent(videosJson)) {
            videosJson =
                videosJson.filter((video: VideoMock) =>
                video.altersbeschränkung === altersbeschränkung);
        }
        if (!isEmpty(videopfad) && isPresent(videosJson)) {
            videosJson =
                videosJson.filter((video: VideoMock) =>
                video.videopfad === videopfad);
        }

        const videos: Array<VideoMock> = isPresent(videosJson) ?
            videosJson.map((b: IVideo) => VideoMock.fromJson(b)) :
            [];
        return Promise.resolve(videos);
    }

    @log
    save(video: any): Promise<MDocument> {
        video._id = <string>generateMongoId().valueOf();
        return Promise.resolve(video);
    }

    @log
    update(video: any): Promise<{}> { return Promise.resolve({}); }

    @log
    remove(id: string): Promise<{}> { return Promise.resolve({}); }

    toString(): string { return 'MockVideosService'; }
}
/* tslint:enable:no-empty */
