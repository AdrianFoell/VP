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

/* global process */

/* eslint-disable quotes */
/* eslint-enable quotes: [2, "single"] */

/**
 * Tasks auflisten
 *    gulp --tasks
 *    gulp --tasks-simple
 */

import gulp from 'gulp';
import gulplog from 'gulplog';

// import debug from 'gulp-debug';
import tslintModule from 'tslint';
import gulpTslint from 'gulp-tslint';
import gulpNewer from 'gulp-newer';
import gulpReplace from 'gulp-replace';
import gulpClangFormat from 'gulp-clang-format';
import clangFormatPkg from 'clang-format';
import gulpTypescript from 'gulp-typescript';
import typescript from 'typescript';

import chalk from 'chalk';
import shelljs from 'shelljs';
import rimraf from 'rimraf';

import minimist from 'minimist';
import inquirer from 'inquirer';

const srcDir = 'src';
const distDir = 'dist';
const configDir = 'config';
const dateien = {
    ts: `${srcDir}/**/*.ts`,
    https: `${configDir}/https/*`,
    iamJson: `${srcDir}/iam/service/file/*.json`,
    jwtPem: `${srcDir}/iam/service/jwt/*.pem`,
    mongoExpress: `${configDir}/mongo-express/*`,
    nodemon: `${configDir}/nodemon/*`
};
const dbname = 'mydb';

let username;
let password;

function tslint(done) {
    'use strict';
    // Alternative: yargs https://www.npmjs.com/package/yargs
    const argv = minimist(process.argv.slice(2));
    if (argv.nocheck) {
        done();
        return;
    }

    gulp.src(dateien.ts)
        //.pipe(debug({title: 'tslint:'}))
        .pipe(gulpTslint({tslint: tslintModule}))
        .pipe(gulpTslint.report('verbose'));
    done();
}
gulp.task(tslint);

function clangFormat(done) {
    'use strict';
    // Alternative: yargs https://www.npmjs.com/package/yargs
    const argv = minimist(process.argv.slice(2));
    if (argv.nocheck) {
        done();
        return;
    }

    // http://clang.llvm.org/docs/ClangFormatStyleOptions.html
    return gulp.src(dateien.ts)
        // clang ist ein C/C++/Objective-C Compiler des Projekts LLVM http://www.llvm.org
        // Formatierungseinstellungen in .clang-format:
        // Google (default) http://google-styleguide.googlecode.com/svn/trunk/cppguide.html
        // LLVM http://llvm.org/docs/CodingStandards.html
        // Chromium http://www.chromium.org/developers/coding-style
        // Mozilla https://developer.mozilla.org/en-US/docs/Developer_Guide/Coding_Style
        // WebKit http://www.webkit.org/coding/coding-style.html
        .pipe(gulpClangFormat.checkFormat('file', clangFormatPkg, {verbose: true}))
        .on('warning', function(e) {
            process.stdout.write(e.message);
            done();
            process.exit(1);
        });
}
gulp.task(clangFormat);

// FIXME clang-format kann nicht parallel zu tslint ausgefuehrt werden
gulp.task('check', gulp.series(tslint, clangFormat));

function tsc() {
    'use strict';
    const tsProject = gulpTypescript.createProject('tsconfig.json', {typescript: typescript});
    return tsProject.src().pipe(gulpTypescript(tsProject)).js.pipe(gulp.dest(distDir));
}
gulp.task('ts', gulp.series('check', tsc));

function httpsConfig(done) {
    'use strict';
     gulp.src(dateien.https)
        .pipe(gulpNewer(`${distDir}/https`))
        .pipe(gulp.dest(`${distDir}/https`));
     done();
}
gulp.task(httpsConfig);

function iamJson(done) {
    'use strict';
     gulp.src(dateien.iamJson)
        .pipe(gulpNewer(`${distDir}/iam/service/file`))
        .pipe(gulp.dest(`${distDir}/iam/service/file`));
     done();
}
gulp.task(iamJson);

function jwtPem(done) {
    'use strict';
     gulp.src(dateien.iamJson)
        .pipe(gulpNewer(`${distDir}/iam/service/jwt`))
        .pipe(gulp.dest(`${distDir}/iam/service/jwt`));
     done();
}
gulp.task(jwtPem);

function nodemonConfig(done) {
    'use strict';
     gulp.src(dateien.nodemon)
        .pipe(gulpNewer(`${distDir}`))
        .pipe(gulp.dest(`${distDir}`));
     done();
}
gulp.task(nodemonConfig);

function mongoExpressConfig(done) {
    'use strict';
     gulp.src(dateien.mongoExpress)
        .pipe(gulpNewer('node_modules/mongo-express'))
        .pipe(gulp.dest('node_modules/mongo-express'));
     done();
}
gulp.task(mongoExpressConfig);

gulp.task('default', gulp.parallel('ts', httpsConfig, iamJson, jwtPem, nodemonConfig, mongoExpressConfig));

// Empfehlung: Kein Auto-Save im Editor
gulp.task('watch', gulp.series('default', () => {
    'use strict';
    // Aenderungen an TypeScript-Dateien?
    gulp.watch([dateien.ts], gulp.parallel('ts'));
}));

function clean(done) {
    'use strict';
    rimraf(distDir, (e) => { if (e) { throw e; }});
    done();
}
gulp.task(clean);

gulp.task('rebuild', gulp.series(clean, 'default'));

function nodemon(done) {
    'use strict';
    // Konfigurationsdatei nodemon.json aus dem Verzeichnis config/nodemon
    shelljs.exec(`cd ${distDir} && node ../node_modules/nodemon/bin/nodemon.js`);
    done();
}
gulp.task(nodemon);

function mongostart(done) {
    'use strict';
    shelljs.exec('mongod --auth --dbpath C:/Zimmermann/MongoDB-data/db --logpath C:/Zimmermann/MongoDB-data/server.log --wiredTigerCacheSizeGB 1 --nssize 8 --maxConns 5 --nojournal');
    done();
}
gulp.task(mongostart);

function mongostop(done) {
    'use strict';
    shelljs.exec('mongo -u admin -p p --eval "db.shutdownServer()" admin');
    done();
}
gulp.task(mongostop);

function mongoimport(done) {
    'use strict';
    shelljs.exec(`mongoimport -v -u zimmermann -p p -d ${dbname} -c roles --drop --file mongoimport/roles.json`);
    shelljs.exec(`mongoimport -v -u zimmermann -p p -d ${dbname} -c users --drop --file mongoimport/users.json`);
    shelljs.exec(`mongoimport -v -u zimmermann -p p -d ${dbname} -c videos --drop --file mongoimport/videos.json`);
    done();
}
gulp.task(mongoimport);

function mongoexport(done) {
    'use strict';
    shelljs.exec(`mongoexport -v -u zimmermann -p p -d ${dbname} -c videos -o EXPORT.videos.json --pretty`);
    gulplog.info(chalk.yellow.bgRed.bold('Der Mongo-Export ist in der Datei EXPORT.videos.json'));
    done();
}
gulp.task(mongoexport);

function mongoexpress(done) {
    'use strict';
    shelljs.exec(`cd node_modules/mongo-express && node app.js -u zimmermann -p p -d ${dbname}`);
    done();
}
gulp.task(mongoexpress);

function promptUsernamePassword(done) {
    'use strict';
    const questions = [
        {
            message: 'Username: ',
            name: 'username'
        },
        {
            message: 'Password: ',
            name: 'password',
            type: 'password'
        }
    ];
    inquirer.prompt(questions, (answers) => {
        username = answers.username;
        password = answers.password;
        done();
    });
}

function proxyNpm(done) {
    'use strict';
    shelljs.exec(`npm c set proxy http://${username}:${password}@proxy.hs-karlsruhe.de:8888`);
    shelljs.exec(`npm c set https-proxy http://${username}:${password}@proxy.hs-karlsruhe.de:8888`);
    done();
}

// Git fuer z.B. Alpha-Releases von GitHub (z.B. gulp 4.0.0.alpha2)
function proxyGit(done) {
    'use strict';
    shelljs.exec(`git config --global http.proxy http://${username}:${password}@proxy.hs-karlsruhe.de:8888`);
    shelljs.exec(`git config --global https.proxy http://${username}:${password}@proxy.hs-karlsruhe.de:8888`);
    shelljs.exec('git config --global url."http://".insteadOf git://');
    done();
}

function proxyTypings(done) {
    'use strict';
    gulp.src('config/proxy/.typingsrc')
        .pipe(gulpReplace('USERNAME', username))
        .pipe(gulpReplace('PASSWORD', password))
        .pipe(gulp.dest('.'));
    done();
}

gulp.task('proxy', gulp.series(promptUsernamePassword, gulp.parallel(proxyNpm, proxyGit, proxyTypings)));

function noproxyNpm(done) {
    'use strict';
    shelljs.exec('npm c delete proxy');
    shelljs.exec('npm c delete https-proxy');
    done();
}

function noproxyGit(done) {
    'use strict';
    shelljs.exec('git config --global --unset http.proxy');
    shelljs.exec('git config --global --unset https.proxy');
    shelljs.exec('git config --global --unset url."http://".insteadOf');
    done();
}

function noproxyTypings(done) {
    'use strict';
    rimraf('.typingsrc', (e) => { if (e) { throw e; }});
    done();
}

gulp.task('noproxy', gulp.parallel(noproxyNpm, noproxyGit, noproxyTypings));

function notes(done) {
    'use strict';
    gulplog.info(chalk.yellow.bgRed.bold(`Besser direkt aufrufen: notes ${srcDir}`));
    shelljs.exec(`notes ${srcDir}`);
    done();
}
gulp.task(notes);

function deps(done) {
    'use strict';
    gulplog.info(chalk.yellow.bgRed.bold('Besser direkt aufrufen: npm-dview'));
    shelljs.exec('npm-dview');
    done();
}
gulp.task(deps);
