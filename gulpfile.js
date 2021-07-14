'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
const htmlmin = require('gulp-htmlmin');
const mjml = require('gulp-mjml');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const mjmlEngine = require('mjml');

// Configs
let inputPath = './source/views/**/*.pug';
let tempPath = './temp';
let outputPath = './build';

function handleError (err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('build', () => {
    return gulp.src(inputPath)
        .pipe(pug({
            pretty: true
        }))
        .pipe(rename({
            extname: '.mjml'
        }))
        .pipe(gulp.dest(tempPath))
        .pipe(mjml(mjmlEngine, {validationLevel: 'strict'}))
        .on('error', handleError)
        .pipe(gulp.dest(outputPath))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
});

gulp.task('mjml', () => {
    return gulp.src(tempPath)
        .pipe(mjml())
        .pipe(gulp.dest(outputPath))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
})

gulp.task('browser-sync', (cb) => {
    browserSync({
        server: {
            baseDir: outputPath
        },
        port: 4000
    }, cb);
});

gulp.task('watch', () => {
    return gulp.watch(inputPath, gulp.series(
        'build'
    ));
});

gulp.task('default', gulp.series(
    'build',
    'browser-sync',
    'watch'
));
