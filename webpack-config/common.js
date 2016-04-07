const paths = require('./paths');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.ejs?$/,
        loaders: ['raw'],
        include: paths.lib
      },
      {
        test: /\.(jsx|js)?$/,
        loaders: ['babel?cacheDirectory'],
        include: paths.lib
      }
    ]
  }
};
