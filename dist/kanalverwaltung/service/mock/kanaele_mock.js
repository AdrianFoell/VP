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
exports.kanalMock = {
    _id: new mongodb_1.ObjectID('000000000000000000000001'),
    name: 'Alpha',
    beschreibung: 'Das ist ein Tiervideo'
};
exports.kanaeleMock = [
    {
        _id: new mongodb_1.ObjectID('000000000000000000000001'),
        name: 'Beta',
        beschreibung: 'Das ist ein Actionvideo'
    },
    {
        _id: new mongodb_1.ObjectID('000000000000000000000002'),
        name: 'Gamma',
        beschreibung: 'Das ist ein Horrorvideo'
    },
    {
        _id: new mongodb_1.ObjectID('000000000000000000000003'),
        name: 'Hugo',
        beschreibung: 'Das ist ein Sportvideo'
    },
    {
        _id: new mongodb_1.ObjectID('000000000000000000000004'),
        name: 'Karl',
        beschreibung: 'Das ist ein Modevideo'
    },
    {
        _id: new mongodb_1.ObjectID('000000000000000000000005'),
        name: 'Otto',
        beschreibung: 'Das ist ein Tiervideo',
    }
];
