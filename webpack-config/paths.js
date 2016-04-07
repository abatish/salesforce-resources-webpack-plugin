const path = require('path');
const dir = path.dirname(__dirname);

module.exports = {
  lib: path.join(dir, 'lib'),
  dist: path.join(dir, 'dist')
};
