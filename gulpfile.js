'use strict';

const gulp = require("gulp");
const ts = require("gulp-typescript");
const uglify = require('gulp-uglify');
const path = require('path');
const _ = require('underscore');

gulp.task("default", function () {
    console.info('default gulp task');
});

gulp.task('clean', function () {
    let rimrfa = require('rimraf');
    rimrfa.sync('dist');
    rimrfa.sync('releases')
});

gulp.task('copyPage', function () {
    return gulp.src('src/page/**')
        .pipe(gulp.dest('dist/page'));
});

gulp.task('copyRes', function () {
    return gulp.src('src/res/**')
        .pipe(gulp.dest('dist/res'))
});

gulp.task('dev', ['copyPage', 'copyRes'], function () {
    let tsProject = ts.createProject("src/tsconfig.json");

    return tsProject.src()
        .pipe(tsProject())
        .js
        // .pipe(uglify())
        .pipe(gulp.dest("dist"));
});

gulp.task('release', ['clean', 'copyPage', 'copyRes'], function () {
    let tsProject = ts.createProject("src/tsconfig.json");

    return tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(uglify())
        .pipe(gulp.dest("dist"));
});

/**
 * electron packager.
 */
const packager = require('electron-packager');

const ignoreFunc = function(filepath) {
    const ignoreFiles = [
        '/.DS_Store',
        '/.git',
        '/.gitignore',
        '/.idea',
        '/releases',
        '/src',
        '/gulpfile.js',
        '/npm-debug.log',
        '/dist/test',
    ];
    return ignoreFiles.indexOf(filepath) > -1;
};

const config = {
    dir: __dirname,
    version: require('./package.json').electronVersion,
    prune: true,
    out: path.join(__dirname, 'releases'),
    overwrite: true,
    asar: true,
    ignore: ignoreFunc,
    download: {
        mirror: 'https://npm.taobao.org/mirrors/electron/'
    },
    'app-copyright': 'Copyright by Sky.',

    name: 'Encrypted Note',
    icon: '',
    platform: 'darwin',
    arch: 'x64',
    'app-version': '0.0.1',
    'build-version': '0.0.1',
};

gulp.task('pack-mac', ['release'], function () {
    const settingsMac = _.extend({}, config, {
        platform: 'darwin',
        arch: 'x64',

        'app-bundle-id': '',
        'app-category-type': 'public.app-category.lifestyle',
        'extend-info': '',
        'extra-resource': '',
        'helper-bundle-id': '',
        // 'osx-sign': true,
        'protocol': [],
        'protocol-name': [],
    });

    packager(settingsMac, function (err, appPaths) {
        if (!err) {
            console.info('Pack mac successfully. app paths:', appPaths);
        } else {
            console.info('Pack mac error:', err);
        }
    });
});

gulp.task('pack-linux', ['release'], function () {
    const settingsLinux = _.extend({}, config, {
        platform: 'linux',
        arch: 'ia32',
    });

    packager(settingsLinux, function (err, appPaths) {
        if (!err) {
            console.info('Pack linux successfully. app paths:', appPaths);
        } else {
            console.info('Pack linux error:', err);
        }
    });
});

gulp.task('pack-win', ['release'], function () {
    const settingsWin32 = _.extend({}, config, {
        platform: 'win32',
        arch: 'ia32',

        'win32metadata': {
            CompanyName: 'Sky',
            FileDescription: 'Encrypted Note',
            OriginalFilename: '',
            ProductName: 'Encrypted Note',
            InternalName: 'Encrypted Note'
        }
    });

    packager(settingsWin32, function (err, appPaths) {
        if (!err) {
            console.info('Pack win32 successfully. app paths:', appPaths);
        } else {
            console.info('Pack win32 error:', err);
        }
    });
});

gulp.task('pack', ['pack-mac', 'pack-linux', 'pack-win'], function () {

});
