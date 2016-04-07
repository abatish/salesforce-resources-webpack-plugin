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
    webpack: require('./webpack.config'),
    webpackMiddleware: {
      noInfo: true
    }
  });
};
