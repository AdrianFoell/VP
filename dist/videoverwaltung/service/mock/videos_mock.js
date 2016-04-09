/*
 * Copyright (C) 2015 - 2016 Juergen Zimmermann, Hochschule Karlsruhe
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
const mongodb_1 = require('mongodb');
exports.videoMock = {
    _id: new mongodb_1.ObjectID('000000000000000000000001'),
    titel: 'Alpha',
    erscheinungsdatum: '2015-02-01',
    beschreibung: 'Das ist ein Tiervideo',
    altersbeschränkung: 0,
    videopfad: 'C:/Videos'
};
exports.videosMock = [
    {
        _id: new mongodb_1.ObjectID('000000000000000000000001'),
        titel: 'Beta',
        erscheinungsdatum: '2015-02-03',
        beschreibung: 'Das ist ein Actionvideo',
        altersbeschränkung: 12,
        videopfad: 'C:/Videos'
    },
    {
        _id: new mongodb_1.ObjectID('000000000000000000000002'),
        titel: 'Gamma',
        erscheinungsdatum: '2015-02-01',
        beschreibung: 'Das ist ein Horrorvideo',
        altersbeschränkung: 18,
        videopfad: 'C:/Videos'
    },
    {
        _id: new mongodb_1.ObjectID('000000000000000000000003'),
        titel: 'Hugo',
        erscheinungsdatum: '2015-02-02',
        beschreibung: 'Das ist ein Sportvideo',
        altersbeschränkung: 0,
        videopfad: 'C:/Videos',
    },
    {
        _id: new mongodb_1.ObjectID('000000000000000000000004'),
        titel: 'Karl',
        erscheinungsdatum: '2015-02-01',
        beschreibung: 'Das ist ein Modevideo',
        altersbeschränkung: 0,
        videopfad: 'C:/Videos'
    },
    {
        _id: new mongodb_1.ObjectID('000000000000000000000005'),
        titel: 'Otto',
        erscheinungsdatum: '2015-02-05',
        beschreibung: 'Das ist ein Tiervideo',
        altersbeschränkung: 0,
        videopfad: 'C:/Videos'
    }
];
