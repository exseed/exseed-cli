import path from 'path';

export default function formatOptions(commandOptions) {
  const cwd = process.cwd();
  let NODE_ENV = commandOptions.env || 'development';
  if (['development', 'test', 'production'].indexOf(NODE_ENV) < 0) {
    NODE_ENV = 'development';
  }

  return {
    env: {
      NODE_ENV:    NODE_ENV,
      development: NODE_ENV === 'development',
      test:        NODE_ENV === 'test',
      production:  NODE_ENV === 'production',
    },
    watch: commandOptions.watch === true,
    dir: {
      cliRoot: path.join(__dirname, '../../'),
      root: cwd,
      src: path.join(cwd, commandOptions.source || './src'),
      target: path.join(cwd, commandOptions.target || './build'),
    },
  };
}