'use strict';

const TARGET = process.env.npm_lifecycle_event;
const common = require('./webpack-config/common');
const merge = require('webpack-merge');

if(TARGET === 'tdd' || TARGET === 'test') {
  module.exports = merge(common, require('./webpack-config/test'));
}

if(TARGET === 'build' || !TARGET) {
  module.exports = merge(common, require('./webpack-config/build'));
}
