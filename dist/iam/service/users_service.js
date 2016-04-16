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
const users_service_db_1 = require('./db/users_service_db');
const users_service_file_1 = require('./file/users_service_file');
const shared_1 = require('../../shared/shared');
class UsersService {
    constructor() {
        switch (shared_1.ROLES_USERS) {
            case 'db':
                this._impl = new users_service_db_1.default();
                break;
            case 'files':
                this._impl = new users_service_file_1.default();
                break;
            default:
                throw new Error('Es ist nur "db" und "file" verfuegbar');
        }
    }
    findByUsername(username) {
        return this._impl.findByUsername(username);
    }
    findByEmail(email) { return this._impl.findByEmail(email); }
    toString() { return 'UsersService'; }
}
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [String]), 
    __metadata('design:returntype', Object)
], UsersService.prototype, "findByUsername", null);
__decorate([
    shared_1.log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [String]), 
    __metadata('design:returntype', Object)
], UsersService.prototype, "findByEmail", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UsersService;
