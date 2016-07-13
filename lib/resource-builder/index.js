import path from 'path';
import template from 'lodash/template';
import merge from 'lodash/merge';
import defaults from './default-settings';

class ResourceBuilder {
  constructor() {
    this.options = defaults;
  }

  configure(newOpts) {
    merge(this.options, newOpts);
  };

  _simpleFileFromString(str) {
    return {
      source: () => (str),
      size: () => (str.length)
    }
  };

  _configForExtension(ext) {
    const { staticresource, page } = this.options;

    switch(ext) {
      case staticresource.extension:
        return staticresource;
      case page.extension:
        return page;
    }

    return null;
  }

  renameStaticResources(assets) {
    const { staticresource } = this.options;
    const { assetsExtensions, nameTemplate, extension } = staticresource;
    const compiledNameTemplate = template(nameTemplate);
    const fileTypeMapping = {};


    const assetExtensionNames = assetsExtensions;

    const assetNames = Object.keys(assets).filter(asset => {
      return assetExtensionNames.indexOf(path.extname(asset)) >= 0;
    });

    for(const assetName of assetNames) {
      const file = assets[assetName];
      const oldExtension = path.extname(assetName);
      const options = {
        basename: path.basename(assetName, oldExtension),
        extension: oldExtension.replace('.', '')
      };

      const newAssetName = path.join(
        staticresource.folderName,
        compiledNameTemplate(options) + extension
      );

      delete assets[assetName];
      assets[newAssetName] = file;
      fileTypeMapping[newAssetName] = oldExtension;
    }

    return fileTypeMapping;
  };

  addPage(assets, originalTypes) {
    const { page, staticresource } = this.options;
    const compiledPageTemplate = template(page.template);
    const options = page.templateOptions;
    const assetNames = Object.keys(assets);

    for(const assetName of assetNames){
      const originalType = originalTypes[assetName];

      if(!options[originalType]) {
        options[originalType] = [];
      }

      options[originalType].push(path.basename(assetName, staticresource.extension));
    }

    const pageName = path.join(
      page.folderName,
      page.name + page.extension
    );

    assets[pageName] = this._simpleFileFromString(compiledPageTemplate({ options }));
  }

  addPackage(assets) {
    const { sfPackage } = this.options;

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

  buildMetafileForAsset(assetName, originalTypes) {
    const assetExt = path.extname(assetName);
    const assetConfig = this._configForExtension(path.extname(assetName));

    if(!assetConfig || !assetConfig.metaTemplate) {
      return null;
    }

    const compiledTemplate = template(assetConfig.metaTemplate);

    const options = {
      basename: path.basename(assetName, assetExt),
      filetype: originalTypes[assetName] || 'unknown'
    }

    return this._simpleFileFromString(compiledTemplate({ options }));
  }

  addMetafiles(assets, originalTypes) {
    const { metaExtension } = this.options;

    const assetNames = Object.keys(assets);

    assetNames.forEach(assetName => {
      const metafile = this.buildMetafileForAsset(assetName, originalTypes);

      if(metafile) {
        assets[assetName + metaExtension] = metafile;
      }
    });
  }

  emit(compilation, callback) {
    const originalMappings = this.renameStaticResources(compilation.assets);

    this.addPage(compilation.assets, originalMappings);

    this.addPackage(compilation.assets);

    this.addMetafiles(compilation.assets, originalMappings);

    callback();
  }

  apply(compiler) {
    compiler.plugin('emit', this.emit.bind(this));
  }
}

export default ResourceBuilder;
