'use strict';

let gulp = require("gulp");
let ts = require("gulp-typescript");
let uglify = require('gulp-uglify');
let path = require('path');

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

gulp.task('dev', ['clean', 'copyPage', 'copyRes'], function () {
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

const packager = require('electron-packager');
let ignoreFiles = [
    '/releases',
    '/src',
    '/.git',
    '/src',
    '/.gitignore',
    '/gulpfile.js',
    '/npm-debug.log',
    '/tools.js',
    '/.DS_Store',
    '/.idea'
];

let ignoreFunc = function(filepath) {
    return ignoreFiles.indexOf(filepath) > -1;
};

gulp.task('pack-mac', ['release'], function () {
    const settingsMac = {
        dir: __dirname,
        version: '1.4.8',
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

        'app-bundle-id': '',
        'app-category-type': 'public.app-category.lifestyle',
        'extend-info': '',
        'extra-resource': '',
        'helper-bundle-id': '',
        // 'osx-sign': true,
        'protocol': [],
        'protocol-name': [],
    };

    packager(settingsMac, function (err, appPaths) {
        if (!err) {
            console.info('Pack mac successfully. app paths:', appPaths);
        } else {
            console.info('Pack mac error:', err);
        }
    });
});

gulp.task('pack-linux', ['release'], function () {
    const settingsLinux = {
        dir: __dirname,
        version: '1.4.8',
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
        platform: 'linux',
        arch: 'ia32',
        'app-version': '0.0.1',
        'build-version': '0.0.1',
    };

    packager(settingsLinux, function (err, appPaths) {
        if (!err) {
            console.info('Pack linux successfully. app paths:', appPaths);
        } else {
            console.info('Pack linux error:', err);
        }
    });
});

gulp.task('pack-win', ['release'], function () {
    const settingsWin32 = {
        dir: __dirname,
        version: '1.4.8',
        prune: true,
        out: path.join(__dirname, 'releases'),
        overwrite: true,
        asar: false,
        ignore: ignoreFunc,
        download: {
            mirror: 'https://npm.taobao.org/mirrors/electron/'
        },
        'app-copyright': 'Copyright by Sky.',

        name: 'Encrypted Note',
        icon: '',
        platform: 'win32',
        arch: 'ia32',
        'app-version': '0.0.1',
        'build-version': '0.0.1',

        'win32metadata': {
            CompanyName: 'Xiaomi',
            FileDescription: 'SmartHomePC',
            OriginalFilename: '',
            ProductName: 'SmartHomePC',
            InternalName: 'smart-home-pc'
        }
    };

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
