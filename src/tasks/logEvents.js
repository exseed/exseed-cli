import gutil from 'gulp-util';
import prettyTime from 'pretty-hrtime';

/**
 * This is the gulp cli logging mechanism extracted and modified
 * from the [source](https://github.com/gulpjs/gulp/blob/master/bin/gulp.js#L173)
 */

// Format orchestrator errors
function formatError(e) {
  if (!e.err) {
    return e.message;
  }

  // PluginError
  if (typeof e.err.showStack === 'boolean') {
    return e.err.toString();
  }

  // Normal error
  if (e.err.stack) {
    return e.err.stack;
  }

  // Unknown (string, number, etc.)
  return new Error(String(e.err)).stack;
}

// Wire up logging events
function logEvents(gulpInst) {

  // Total hack due to poor error management in orchestrator
  gulpInst.on('err', function() {
    // failed = true;
  });

  gulpInst.on('task_start', function(e) {
    // TODO: batch these
    // so when 5 tasks start at once it only logs one time with all 5
    gutil.log('Starting', '\'' + gutil.colors.cyan(e.task) + '\'...');
  });

  gulpInst.on('task_stop', function(e) {
    var time = prettyTime(e.hrDuration);
    gutil.log(
      'Finished', '\'' + gutil.colors.cyan(e.task) + '\'',
      'after', gutil.colors.magenta(time)
    );
  });

  gulpInst.on('task_err', function(e) {
    var msg = formatError(e);
    var time = prettyTime(e.hrDuration);
    gutil.log(
      '\'' + gutil.colors.cyan(e.task) + '\'',
      gutil.colors.red('errored after'),
      gutil.colors.magenta(time)
    );
    gutil.log(msg);
  });

  gulpInst.on('task_not_found', function(err) {
    gutil.log(
      gutil.colors.red('Task \'' + err.task + '\' is not in your gulpfile')
    );
    gutil.log('Please check the documentation for proper gulpfile formatting');
    process.exit(1);
  });
}

export default logEvents;