"use strict";

   var gulp = require('gulp'),
     concat = require('gulp-concat'),
     uglify = require('gulp-uglify'),
     rename = require('gulp-rename'),
       sass = require('gulp-sass'),
       maps = require('gulp-sourcemaps'),
        del = require('del'),
   imagemin = require('gulp-imagemin'),
runSequence = require('run-sequence');

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

gulp.task('images', () =>
    gulp.src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/content'))
);

gulp.task('clean', function() {
  del(['dist/**']);
  del();

});

gulp.task('styles', function() {
  return gulp.src(["sass/**.scss"])
      .pipe(maps.init())
      .pipe(sass())
      .pipe(maps.write('./'))
      .pipe(gulp.dest('dist/styles'));
});


gulp.task('watchSass', function() {
  gulp.watch('sass/**/*.sass', ['compileSass']);
})



gulp.task('build', function (callback) {
  runSequence(
    'clean',
    'scripts',
    'styles',
    'images',
    function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('BUILD FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});

gulp.task("default", ["build"]);
