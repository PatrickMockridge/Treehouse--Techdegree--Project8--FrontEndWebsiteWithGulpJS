"use strict";

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
     del = require('del'),
imagemin = require('gulp-imagemin');

gulp.task("concatScripts", function() {
    return gulp.src([
        'js/circle/autogrow.js',
        'js/circle/circle.js',
        'js/global.js'
        ])
    .pipe(maps.init())
    .pipe(concat('global.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('js'));
});

gulp.task("scripts", ["concatScripts"], function() {
  return gulp.src("js/global.js")
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('styles', function() {
  return gulp.src("scss/application.scss")
      .pipe(maps.init())
      .pipe(sass())
      .pipe(maps.write('./'))
      .pipe(gulp.dest('css'));
});

gulp.task('images', () =>
    gulp.src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/content'))
);

gulp.task('watchSass', function() {
  gulp.watch('scss/**/*.scss', ['compileSass']);
})

gulp.task('clean', function() {
  del(['dist', 'css/application.css*', 'js/app*.js*']);
});

gulp.task("build", ['minifyScripts', 'compileSass'], function() {
  return gulp.src(["css/application.css", "js/app.min.js", 'index.html',
                   "img/**", "fonts/**"], { base: './'})
            .pipe(gulp.dest('dist'));
});

gulp.task("default", ["build"]);
