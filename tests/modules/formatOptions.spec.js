const chai = require('chai');
const path = require('path');
const expect = chai.expect;

describe('#formatOptions', () => {
  const formatOptions = require('../../dist/formatOptions').default;
  const cwd = process.cwd();
  const testCases = [{
    description: 'should use `development` env when --env=development',
    input: {
      env: 'development',
    },
    expectedOutput: {
      env: {
        NODE_ENV: 'development',
        development: true,
        test: false,
        production: false,
      },
      watch: false,
      dir: {
        src: path.join(cwd, './src'),
        target: path.join(cwd, './build'),
      },
    },
  }, {
    description: 'should use `test` env when --env=test',
    input: {
      env: 'test',
    },
    expectedOutput: {
      env: {
        NODE_ENV: 'test',
        development: false,
        test: true,
        production: false,
      },
      watch: false,
      dir: {
        src: path.join(cwd, './src'),
        target: path.join(cwd, './build'),
      },
    },
  }, {
    description: 'should use `production` env when --env=production',
    input: {
      env: 'production',
    },
    expectedOutput: {
      env: {
        NODE_ENV: 'production',
        development: false,
        test: false,
        production: true,
      },
      watch: false,
      dir: {
        src: path.join(cwd, './src'),
        target: path.join(cwd, './build'),
      },
    },
  }, {
    description: 'should use default env when given broken env',
    input: {
      env: 'unexpected',
    },
    expectedOutput: {
      env: {
        NODE_ENV: 'development',
        development: true,
        test: false,
        production: false,
      },
      watch: false,
      dir: {
        src: path.join(cwd, './src'),
        target: path.join(cwd, './build'),
      },
    },
  }, {
    description: 'should apply watch when -w or --watch is specified',
    input: {
      watch: true,
    },
    expectedOutput: {
      env: {
        NODE_ENV: 'development',
        development: true,
        test: false,
        production: false,
      },
      watch: true,
      dir: {
        src: path.join(cwd, './src'),
        target: path.join(cwd, './build'),
      },
    },
  }, {
    description: 'should apply given source and target',
    input: {
      source: './testSrc',
      target: './testBuild',
    },
    expectedOutput: {
      env: {
        NODE_ENV: 'development',
        development: true,
        test: false,
        production: false,
      },
      watch: false,
      dir: {
        src: path.join(cwd, './testSrc'),
        target: path.join(cwd, './testBuild'),
      },
    },
  },];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      expect(formatOptions(testCase.input))
        .to.deep.equal(testCase.expectedOutput);
    });
  });
});