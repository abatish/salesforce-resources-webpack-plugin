'use strict';
'use string';

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pluginSettings = {};

function SalesforceResourcePlugin(options) {
  this.pluginSettings = options;
}

var processAsset = function processAsset(asset) {
  console.log(asset);
};

var optimizeAssets = function optimizeAssets(assets, cb) {
  Object.keys(assets).forEach(processAsset);
  cb();
};

var compilation = function compilation(_compilation, params) {
  _compilation.plugin('optimize-assets', undefined.optimizeAssets);
};

SalesforceResourcePlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', compilation);
};

module.exports = SalesforceResourcePlugin;
