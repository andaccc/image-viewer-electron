/**
 * renderer production process
 */

import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import baseConfig from './webpack.config.base';


export default merge(baseConfig, {
  mode: 'production',

  target: 'electron-renderer',

  entry: [
    'core-js',
    'regenerator-runtime/runtime',
    path.join(__dirname, '../../src/renderer/index.jsx'),
  ],

  output: {
    path: path.join(__dirname, '../../build/public/'),
    publicPath: './dist/',
    filename: 'renderer.prod.js',
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
          }
        ]
      },
      {
        test: /.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // `./dist` can't be inerhited for publicPath for styles. Otherwise generated paths will be ./dist/dist
              publicPath: './',
            },
          },
          'css-loader',
          'sass-loader'
        ],
      },
      // WOFF Font
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },
      // WOFF2 Font
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },
      // OTF Font
      {
        test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'font/otf',
          },
        },
      },
      // TTF Font
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream',
          },
        },
      },
      // EOT Font
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader',
      },
      // SVG Font
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml',
          },
        },
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader',
      },
    ],
  },

  optimization: {
    minimize: true,
    minimizer:
      [
        new TerserPlugin({
          parallel: true,
        }),
        new CssMinimizerPlugin(),
      ],
  },

  plugins: [

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
    }),

    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),

    new BundleAnalyzerPlugin({
      analyzerMode:
        process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true',
    }),

    new CopyPlugin({
      patterns: [
        { 
          from: "./src/public/index.html",
          to: "./index.html"
        }
      ]
    })
  ],
});