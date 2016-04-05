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

import {LoggerInstance, Logger, transports} from 'winston';
import {logOptions, mongoMock, dbConn} from './constants';

function loggerConfig(): LoggerInstance {
    'use strict';

    // Log-Level wie bei npm: error, warn, info, verbose, debug, silly
    // https://github.com/winstonjs/winston/blob/master/docs/transports.md
    const logger: LoggerInstance = new (Logger)({
        transports: [
            new (transports.Console)(logOptions.console),
            new (transports.File)(logOptions.file)
        ]
    });

    logger.info('Logging durch Winston ist konfiguriert');
    return logger;
}

export const logger: LoggerInstance = loggerConfig();

if (!mongoMock) {
    dbConn.once('open', () => {
        logger.info('Die Verbindung zu MongoDB ist hergestellt');
    });
}
