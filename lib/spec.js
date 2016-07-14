import chai, { expect } from 'chai';
import spies from 'chai-spies';
import ResourceBuilder from './index';
chai.use(spies);

describe('resource-builder', () => {
  var builder;

  beforeEach(() => {
    builder = new ResourceBuilder();
  });

  describe('renameStaticResources', () => {
    it('use default settings to rename static resources, and leave files untouched', () => {
      const appJs = {}, appCss = {}, vendorJs = {}, otherThing = {};

      const assets = {
        'app.js': appJs,
        'app.css': vendorJs,
        'vendor.js': vendorJs,
        'other.thing': otherThing
      };

      const expected = {
        'other.thing': otherThing,
        'staticresources/appjs.resource': appJs,
        'staticresources/appcss.resource': appCss,
        'staticresources/vendorjs.resource': vendorJs
      }

      const typeMapping = builder.renameStaticResources(assets);

      expect(Object.keys(assets).length).to.be.equal(4);
      expect(assets).to.deep.equal(expected);
      expect(typeMapping['staticresources/appjs.resource']).to.be.equal('.js');
      expect(typeMapping['staticresources/vendorjs.resource']).to.be.equal('.js');
      expect(typeMapping['staticresources/appcss.resource']).to.be.equal('.css');
    });

  });

  describe('addPackage', () => {
    it('should create a package.xml for default settings', () => {
      const assets = {
        'appjs.resource': {},
        'appcss.resource': {}
      };
      builder.addPackage(assets);
      expect(Object.keys(assets).length).to.be.equal(3);
      expect(assets['package.xml']).to.be.a('object');
      expect(assets['package.xml'].source()).to.contain('appjs');
      expect(assets['package.xml'].source()).to.contain('appcss');
    });
  });

  describe('addMetafiles', () => {
    it('should add one metadata file for each resources, and for each page', () => {
      const assets = {
        'staticresources/appjs.resource': {},
        'staticresources/appcss.resource': {},
        'pages/index.page': {}
      };

      const originalTypes = {
        'staticresources/appjs.resource': '.js',
        'staticresources/appcss.resource': '.css'
      };

      builder.addMetafiles(assets, originalTypes);

      expect(Object.keys(assets).length).to.be.equal(6);

      expect(assets['staticresources/appjs.resource-meta.xml']).to.be.a('object');
      expect(assets['staticresources/appjs.resource-meta.xml'].source()).to.contain('application/javascript');
      expect(assets['staticresources/appcss.resource-meta.xml']).to.be.a('object');
      expect(assets['staticresources/appcss.resource-meta.xml'].source()).to.contain('text/css');
      expect(assets['staticresources/appcss.resource']).to.be.a('object');
      expect(assets['staticresources/appjs.resource']).to.be.a('object');
      expect(assets['pages/index.page-meta.xml']).to.be.a('object');
      expect(assets['pages/index.page']).to.be.a('object');
    });
  });

  describe('addPage', () => {
    it('should create a page for default settings, and have reference to each resource', () => {
      const assets = {
        'appjs.resource': {},
        'appcss.resource': {}
      };

      const originalTypes = {
        'appjs.resource': '.js',
        'appcss.resource': '.css'
      };

      builder.addPage(assets, originalTypes);
      expect(Object.keys(assets).length).to.be.equal(3);
      expect(assets['pages/index.page']).to.be.a('object');
      expect(assets['pages/index.page'].source()).to.contain('$Resource.appjs');
      expect(assets['pages/index.page'].source()).to.contain('$Resource.appcss');
    });
  });

  describe('apply', () => {
    const compiler = {
      plugin: (event, cb) => {}
    }

    beforeEach(() => {
      chai.spy.on(compiler, 'plugin');
    })


    it('should call the compiler.plugin function, passing the \'emit\' event name and a function', () => {
      builder.apply(compiler);
      expect(compiler.plugin).to.have.been.called.with('emit');
    });
  });

  describe('emit', () => {
    beforeEach(() => {
      chai.spy.on(builder, 'addPage');
      chai.spy.on(builder, 'addMetafiles');
      chai.spy.on(builder, 'addPackage');
      chai.spy.on(builder, 'renameStaticResources');
    });

    it('should call addPage, addMetafiles, addPackage, and renameStaticResources', () => {
      builder.emit({ assets: [] }, () => {});
      expect(builder.addPage).to.have.been.called;
      expect(builder.addMetafiles).to.have.been.called;
      expect(builder.addPackage).to.have.been.called;
      expect(builder.renameStaticResources).to.have.been.called;
    });
  });

});
