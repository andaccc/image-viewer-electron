import path from 'path';
import webpack from 'webpack';
import { dependencies as externals } from '../../package.json';

export default {
  /*
  externals: [...Object.keys(externals || {})],
  */
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [path.join(__dirname, '../'), 'node_modules']
  }
}