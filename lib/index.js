'use strict';

var path = require('path');
var template = require('lodash/template');
var merge = require('lodash/merge');
var defaults = require('./default-settings');
var JSZip = require('jszip');
var RawSource = require("webpack-sources/lib/RawSource");

class ResourceBuilder {
  constructor(options) {
    this.options = merge(defaults, options);
  }

  _simpleFileFromString(str) {
    return {
      source: () => (str),
      size: () => (str.length)
    }
  };

  _configForExtension(ext) {
    const staticresource = this.options.staticresource;
    const page = this.options[this.options.pageType];

    switch(ext) {
      case staticresource.extension:
        return staticresource;
      case page.extension:
        return page;
    }

    return null;
  }


  _isRootAsset(filename, chunks) {
    for(var x = 0; x < chunks.length; x++) {
      const currentChunk = chunks[x];

      if(!currentChunk.name) {
        for(var y = 0; y < currentChunk.files.length; y++) {
          const currentFile = currentChunk.files[y];

          if(filename === currentFile) {
            return false;
          }
        }
      }
    }

    return true;
  }

  generateBundle(assets) {
    const staticresource = this.options.staticresource;
    const fileTypeMapping = {};
    const zip = new JSZip();

    const assetExtensionNames = staticresource.assetsExtensions;

    const assetNames = Object.keys(assets).filter(asset => {
      return assetExtensionNames.indexOf(path.extname(asset)) >= 0;
    });

    for(const assetName of assetNames) {
      const extname = path.extname(assetName);
      zip.file(assetName, assets[assetName].source())
      fileTypeMapping[assetName] = extname;
      delete assets[assetName];
    }

    const destRes = path.join(staticresource.folderName, staticresource.name + staticresource.extension);

    return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }).then(content => {
      assets[destRes] = new RawSource(content);
      return fileTypeMapping;
    });
  };

  addPage(assets, chunks, originalTypes) {
    const page = this.options[this.options.pageType];
    const staticresource = this.options.staticresource;
    const compiledPageTemplate = template(page.template);
    const options = page.templateOptions;
    const assetNames = Object.keys(assets);

    for(const assetName of Object.keys(originalTypes)) {
      const originalType = originalTypes[assetName];

      if(!options[originalType]) {
        options[originalType] = [];
      }

      if(this._isRootAsset(assetName, chunks)) {
        options[originalType].push(path.basename(assetName, staticresource.extension));
      }
    }

    options.zipName = staticresource.name;

    const pageName = path.join(
      page.folderName,
      page.name + page.extension
    );

    assets[pageName] = this._simpleFileFromString(compiledPageTemplate({ options }));
  }

  addPackage(assets) {
    const sfPackage = this.options.sfPackage;

    const compiledPackageTemplate = template(sfPackage.template);
    const options = merge(sfPackage.templateOptions, { resources: [], pages: [] });
    const assetNames = Object.keys(assets);

    for(const assetName of assetNames) {
      const assetExt = path.extname(assetName);
      const assetConfig = this._configForExtension(assetExt);

      if(assetConfig) {
        if(!options[assetConfig.extension]){
          options[assetConfig.extension] = [];
        }

        options[assetConfig.extension].push(path.basename(assetName, assetExt));
      }
    }

    assets[sfPackage.name + sfPackage.extension] = this._simpleFileFromString(compiledPackageTemplate({ options }));
  };

  buildMetafileForAsset(assetName) {
    const assetExt = path.extname(assetName);
    const assetConfig = this._configForExtension(path.extname(assetName));

    if(!assetConfig || !assetConfig.metaTemplate) {
      return null;
    }

    const compiledTemplate = template(assetConfig.metaTemplate);

    const options = Object.assign({}, assetConfig.metaTemplateOptions || {}, {
      basename: path.basename(assetName, assetExt)
    });

    return this._simpleFileFromString(compiledTemplate({ options }));
  }

  addMetafiles(assets) {
    const metaExtension = this.options.metaExtension;

    const assetNames = Object.keys(assets);

    assetNames.forEach(assetName => {
      const metafile = this.buildMetafileForAsset(assetName);

      if(metafile) {
        assets[assetName + metaExtension] = metafile;
      }
    });
  }

  emit(compilation, callback) {
    const files = {};

    return this.generateBundle(compilation.assets).then(zippedAssets => {
        this.addPage(compilation.assets, compilation.chunks, zippedAssets);
        this.addPackage(compilation.assets);
        this.addMetafiles(compilation.assets);
        callback();
    });
  }

  apply(compiler) {
    return compiler.plugin('emit', this.emit.bind(this));
  }
}

module.exports = ResourceBuilder;
