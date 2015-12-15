var gulp  = require('gulp'),
    gutil = require('gulp-util'),

    jshint       = require('gulp-jshint'),
    sass         = require('gulp-sass'),
    concat       = require('gulp-concat'),
    plumber      = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    concatCSS    = require('gulp-concat-css'),
    notify       = require('gulp-notify'),
    sourcemaps   = require('gulp-sourcemaps'),
    babel        = require('gulp-babel'),
    bower        = require('gulp-bower'),
    browserSync  = require('browser-sync').create(),
    reload       = browserSync.reload,

    input  = {
      'html': 'source/**/*.html',
      'sass': 'source/scss/**/*.scss',
      'js': 'source/js/**/*.js',
      'vendorjs': 'public/assets/js/vendor/**/*.js'
    },

    output = {
      'html': 'public',
      'css': 'public/assets/css',
      'js': 'public/assets/js',
      'vendor': 'public/assets/js/vendor'
    };

var onError = function(err) {
  console.log(err);
};

gulp.task('default', ['bower', 'html', 'jshint', 'scripts', 'styles', 'watch']);

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest(output.vendor))
});

gulp.task('html', function() {
    return gulp.src(input.html)
      .pipe(gulp.dest(output.html));
});

gulp.task('jshint', function() {
    return gulp.src(input.js)
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('scripts', function() {
    return gulp.src(input.js)
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(concat('main.js'))
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(output.js));
});

gulp.task('styles', function() {
    return gulp.src(input.sass)
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(output.css));
});

gulp.task('watch', function() {
  browserSync.init({
    server: "./public"
  });

  gulp.watch(input.sass, ['styles'])
    .on('change', browserSync.reload);

  gulp.watch(input.js, ['jshint', 'scripts'])
    .on('change', browserSync.reload);

  gulp.watch(input.html, ['html'])
    .on('change', browserSync.reload);
});
