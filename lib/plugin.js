'use string';

import RawSource from 'webpack'

let pluginSettings = {};

function SalesforceResourcePlugin(options) {
  this.pluginSettings = options;
}

const processAsset = (asset) => {
  console.log(asset);
};

const optimizeAssets = (assets, cb) => {
  Object.keys(assets).forEach(processAsset);
  cb();
};

const compilation = (compilation, params) => {
  compilation.plugin('optimize-assets', optimizeAssets);
};

SalesforceResourcePlugin.prototype.apply = (compiler) => {
  compiler.plugin('compilation', compilation);
};

module.exports = SalesforceResourcePlugin;
