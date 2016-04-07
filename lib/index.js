'use string';

import ResourceBuilder from './resource-builder';

let pluginSettings = {};

function SalesforceResourcePlugin(options) {
  this.builder = new ResourceBuilder();
  this.builder.configure(options);
}

SalesforceResourcePlugin.prototype.apply = function(compiler) {
  this.builder.apply(compiler)
};

module.exports = SalesforceResourcePlugin;
