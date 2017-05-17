const path = require('path');
const webpack = require('webpack');

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
      module: {
        loaders: [
          {
            exclude: /node_modules/,
            loader: "babel",
            test: /\.js$/,
          }
        ]
      },

      plugins: [
        // Functional components should be lib-agnostic
        new webpack.ProvidePlugin({ React: "react" }),
      ],
    },
    webpackMiddleware: {
      noInfo: true
    }
  });
};
