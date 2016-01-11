import defineTasks from './defineTasks';
import logEvents from './logEvents';

export default function registerTasks(opts) {
  let gulpInst = defineTasks(opts);
  // since we are calling gulp tasks from node scripts
  // instead of `gulp` command, we use the logging
  // function extracted from gulp's source code
  // to keep logs working properly
  logEvents(gulpInst);
}