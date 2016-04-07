const paths = './paths';

module.exports = {
  devtool: 'inline-source-map',
  resolve: {
    alias: {
      lib: paths.lib
    }
  },
  module: {
    preLoaders: [{
      test: /^((?!spec).)*\.js$/,
      loaders: [ 'isparta-instrumenter' ],
      include: paths.lib
    }]
  }
};
