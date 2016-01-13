// ====================
// Packages and modules
// ====================

// native packages
import path from 'path';
import fs from 'fs';

// vendor packages
import gulp from 'gulp';
import gutil from 'gulp-util';
import changed from 'gulp-changed';
import rimraf from 'rimraf';
import babel from 'gulp-babel';
import webpack from 'webpack';
import sourcemaps from 'gulp-sourcemaps';
import gulpif from 'gulp-if';
import notify from 'gulp-notify';
import nodemon from 'gulp-nodemon';
import mocha from 'gulp-mocha';

// local modules
import defaultBabelConfig from '../configs/babel.default';
import { outputFormatOptions } from '../utils/';

export default function defineTasks(opts) {
  // file wildcards relative to the project root
  // const options = {
  //   src: {
  //     base: opts.dir.src,
  //   },
  //   dest: {
  //     cwd: opts.dir.target,
  //   },
  // };

  const files = {
    scripts: [
      path.join(opts.dir.src, '**/*.js'),
      '!' + path.join(opts.dir.src, '*/public/**/*.js'),
    ],
    reacts: [
      path.join(opts.dir.src, '*/flux/**/*.js'),
    ],
    statics: [
      path.join(opts.dir.src, '*/public/**/*'),
    ],
    nodemonWatchIgnore: [
      'gulpfile.js',
      'node_modules/**/*',
      path.join(opts.dir.src, '**/*'),
      path.join(opts.dir.target, '*/public/js/bundle.js'),
      path.join(opts.dir.target, 'public/js/common.js'),
      path.join(opts.dir.target, '*/flux/**/*'),
    ],
  };

  // clean build files
  gulp.task('clean', (done) => {
    rimraf.sync(opts.dir.target);
    done();
  });

  // output formated options
  gulp.task('output:options', ['clean'], (done) => {
    outputFormatOptions(opts, done);
  });

  // build source files
  gulp.task('build', () => {
    return gulp
      .src(files.scripts)
      .pipe(gulpif(opts.watch, changed(opts.dir.target)))
      .pipe(gulpif(opts.env.development, sourcemaps.init()))
        .pipe(babel(defaultBabelConfig))
        .on('error', notify.onError({
          title: 'babel fail',
          message: '<%= error.message %>',
        }))
      .pipe(gulpif(opts.env.development, sourcemaps.write({
        includeContent: false,
        sourceRoot: (file) => path.join(process.cwd(), opts.dir.src),
      })))
      .pipe(gulp.dest(opts.dir.target));
  });

  // bundle react components
  gulp.task('webpack', ['build'], (cb) => {
    const webpackConfig = require(`../configs/webpack.${opts.env.NODE_ENV}`).default;
    const settings = require(path.join(opts.dir.target, 'settings.js')).default;
    const { installedApps } = settings;
    const appAliasArray = installedApps
      .map((appPath) => {
        const appSrcPath = path.join(opts.dir.src, appPath);
        const appTargetPath = path.join(opts.dir.target, appPath);
        const entryPath = path.join(appSrcPath, 'flux/boot.js');
        if (fs.existsSync(entryPath)) {
          const appDirName = path.parse(appSrcPath).base;
          const appSettings = require(path.join(appTargetPath, 'settings.js')).default;
          const appAlias = appSettings.name;
          webpackConfig.entry[appDirName] = [ entryPath, ];
          return appAlias;
        }
        return false;
      })
      .filter((appAlias) => appAlias);

    webpackConfig.output.path = opts.dir.target;
    webpackConfig.plugins.push(
      new webpack.optimize.CommonsChunkPlugin(
        'public/js/common.js', appAliasArray),
    );

    webpack(webpackConfig, (err, stats) => {
      if (err) {
        gutil.log(err);
      } else {
        cb();
      }
    });
  });

  // copy static files
  gulp.task('copy', function() {
    return gulp
      .src(files.statics/*, {
        read: false,
      }*/)
      .pipe(gulpif(opts.watch, changed(opts.dir.target)))
      .pipe(gulp.dest(opts.dir.target));
  });

  gulp.task('serve', (cb) => {
    let started = false;
    const entryPath = path.join(opts.dir.target, 'server.js');

    return nodemon({
      script: entryPath,
      watch: [`${opts.dir.target}/**/*.js`],
      ext: 'js',
      env: {
        NODE_ENV: opts.env.NODE_ENV,
      },
      ignore: files.nodemonWatchIgnore,
    })
    .on('start', () => {
      if (!started) {
        cb();
        started = true;
      }
    })
    .on('restart', () => {
    });
  });

  // watching source files
  gulp.task('watch', ['build', 'webpack', 'copy'], () => {
    if (opts.watch) {
      gulp.watch(files.scripts, ['build']);
      gulp.watch(files.reacts, ['webpack']);
      gulp.watch(files.statics, ['copy']);
    }
  });

  return gulp;
}