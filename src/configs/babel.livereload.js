export default {
  plugins: [
    require.resolve('babel-plugin-transform-decorators-legacy'),
  ],
  presets: [
    require.resolve('babel-preset-react-hmre'),
    require.resolve('babel-preset-stage-0'),
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-react'),
  ],
};