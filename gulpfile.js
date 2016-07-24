"use strict";

   var gulp = require('gulp'),
//for concatenation
     concat = require('gulp-concat'),
// for mushing and squashing
     uglify = require('gulp-uglify'),
// for changing file names
     rename = require('gulp-rename'),
// for compiling sass
       sass = require('gulp-sass'),
// for creating source maps
       maps = require('gulp-sourcemaps'),
// for deleting stuff
        del = require('del'),
// for compressing images
   imagemin = require('gulp-imagemin'),
// for running things in sequence with promises
runSequence = require('run-sequence'),
// linting tool
     eslint = require('gulp-eslint'),
// build a web server with gulp-connect
      connect = require('gulp-connect');
// concatentate written JS and pipe to js/global.js with source map
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
// minify global.js and pipe to distribution
gulp.task("scripts", ["concatScripts"], function() {
  return gulp.src("js/global.js")
    .pipe(maps.init())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(connect.reload());
});
// compress images and pipe to distribution
gulp.task('images', () =>
    gulp.src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/content'))
);
// clean distribution folder
gulp.task('clean', function() {
  del(['dist/content/**']);
  del(['dist/scripts/**']);
  del(['dist/styles/**']);
});
// compile SASS
gulp.task('styles', function() {
  return gulp.src(["sass/**.scss"])
      .pipe(maps.init())
      .pipe(sass())
      .pipe(maps.write('./'))
      .pipe(gulp.dest('dist/styles'))
      .pipe(connect.reload());
});


gulp.task('watch', function () {
  gulp.watch(['sass/**/*.scss', 'sass/**/*.sass'], ['styles']);
  gulp.watch(['js/**/*.js'], ['scripts']);
});

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

gulp.task('webserver', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('serve', ['webserver', 'watch']);

gulp.task("default", ["build"]);
