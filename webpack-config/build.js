const paths = require('./paths');

module.exports = {
  entry: {
    app: paths.lib
  },
  output: {
    path: paths.dist,
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    library: 'SalesforceResourcePlugin'
  }
}
