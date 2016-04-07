import packageMetaTemplate from '../templates/metadata/package.xml.ejs';
import pageMetaTemplate from '../templates/metadata/page.xml.ejs';
import pageTemplate from '../templates/content/page.ejs';
import staticResourceMetaTemplate from '../templates/metadata/staticresource.xml.ejs';

module.exports = {
  metaExtension: '-meta.xml',
  staticresource: {
    folderName: 'staticresources',
    generate: true,
    extension: '.resource',
    nameTemplate: '<%= basename %><%= extension %>',
    metaTemplate: staticResourceMetaTemplate,
    assetsExtensions: ['.css', '.js']
  },
  page: {
    folderName: 'pages',
    generate: true,
    extension: '.page',
    name: 'index',
    appMountId: 'app',
    template: pageTemplate,
    metaTemplate: pageMetaTemplate,
    templateOptions: {
      showHeader: false,
      sidebar: false,
      standardStylesheets: false,
      applyHtmlTag: false,
      applyBodyTag: false,
      appMountId: 'app'
    }
  },
  sfPackage: {
    generate: true,
    extension: '.xml',
    name: 'package',
    template: packageMetaTemplate,
    templateOptions: {
      apiVersion: '36.0'
    }
  }
}
