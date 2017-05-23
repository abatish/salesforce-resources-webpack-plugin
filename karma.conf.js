const path = require('path');

module.exports = function karmaConfig(config) {

  config.set({
    frameworks: [ 'mocha', 'chai' ],
    reporters: [ 'spec', 'coverage' ],
    files: [
      'node_modules/phantomjs-polyfill/bind-polyfill.js',
      'lib/**/*spec.js'
    ],
    preprocessors: {
      'lib/**/*spec.js': [ 'webpack', 'sourcemap' ]
    },
    browsers: [ 'Chrome' ],
    singleRun: true,
    coverageReporter: {
      dir: 'coverage/',
      type: 'html'
    },
    webpack: {
      entry: path.resolve(__dirname, "lib"),
      module: {
        loaders: [
          {
            include: [
              path.resolve(__dirname, "lib")
            ],
            loader: "babel-loader",
            test: /\.js$/,
          }
        ]
      }
    },
    webpackMiddleware: {
      noInfo: true
    }
  });
};
