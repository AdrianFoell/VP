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
const winston_1 = require('winston');
const constants_1 = require('./constants');
function loggerConfig() {
    'use strict';
    // Log-Level wie bei npm: error, warn, info, verbose, debug, silly
    // https://github.com/winstonjs/winston/blob/master/docs/transports.md
    const logger = new (winston_1.Logger)({
        transports: [
            new (winston_1.transports.Console)(constants_1.LOG_OPTIONS.console),
            new (winston_1.transports.File)(constants_1.LOG_OPTIONS.file)
        ]
    });
    logger.info('Logging durch Winston ist konfiguriert');
    return logger;
}
exports.logger = loggerConfig();
if (!constants_1.MONGO_MOCK) {
    constants_1.dbConn.once('open', () => {
        exports.logger.info('Die Verbindung zu MongoDB ist hergestellt');
    });
}
