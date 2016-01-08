const path = require('path');
const gulp = require('gulp');
const notify = require("gulp-notify");
const changed = require('gulp-changed');
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

const files = {
  src: [
    './src/**/*.js',
  ],
};

gulp.task('clean', () => {
  return gulp
    .src('./build', {
      read: false,
    })
    .pipe(clean());
});

// build source files
gulp.task('build', ['clean'], () => {
  return gulp
    .src(files.src)
    .pipe(changed('./dist'))
    .pipe(sourcemaps.init())
      .pipe(babel({
        presets: [
          'stage-0',
          'es2015',
          'react',
        ],
      }))
      .on('error', notify.onError({
        title: 'babel fail',
        message: '<%= error.message %>',
      }))
    .pipe(sourcemaps.write({
      includeContent: false,
      sourceRoot: (file) => {
        return path.resolve(__dirname, 'src');
      },
    }))
    .pipe(gulp.dest('./dist'));
});

// watching source files
gulp.task('watch', () => {
  gulp.watch(files.src, ['build']);
});

// run gulp tasks
gulp.task('default', () => {
  gulp.start('clean', 'build', 'watch');
});