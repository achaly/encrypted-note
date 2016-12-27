'use strict';

let gulp = require("gulp");
let ts = require("gulp-typescript");
let uglify = require('gulp-uglify');

gulp.task("default", function () {
    console.info('default gulp task');
});

gulp.task('clean', function () {
    let rimrfa = require('rimraf');
    rimrfa.sync('dist');
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

gulp.task('pack-mac', ['release'], function () {

});

gulp.task('pack-linux', ['release'], function () {

});

gulp.task('pack-win', ['release'], function () {

});

gulp.task('pack', ['pack-mac', 'pack-linux', 'pack-win'], function () {

});
