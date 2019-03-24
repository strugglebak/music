const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'development',
  entry: {
    admincss: path.resolve(__dirname, './src/js/admin/admin.css.js'),
    admin: path.resolve(__dirname, './src/js/admin/admin.js'),

    indexcss: path.resolve(__dirname, './src/js/index/index.css.js'),
    index: path.resolve(__dirname, './src/js/index/index.js'),

    songcss: path.resolve(__dirname, './src/js/song/song.css.js'),
    song: path.resolve(__dirname, './src/js/song/song.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    chunkFilename: '[id].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
            }
          },
          "css-loader"
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            // 配置 url-loader 的可选项
            options: {
              // 限制 图片大小 10000B，小于限制会将图片转换为 base64格式
              limit: 10000,
              // 超出限制，创建的文件格式
              // dist/images/[图片名].[hash].[图片格式]
              name: 'images/[name].[hash].[ext]'
            }
          }
        ]
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "css/[name].css",
      chunkFilename: "[id].css"
    }),
    new webpack.ProvidePlugin({
      AV: 'leancloud-storage',
      plupload: 'plupload',
      Qiniu: path.resolve(path.join(__dirname, 'node_modules/my-qiniu-js/src/qiniu.js')),
      $: 'jquery',
    }),
    new CopyWebpackPlugin([{
      from: __dirname + '/src/img/',
      to: __dirname + '/dist/img'
    }]),
    new HtmlWebpackPlugin({
      filename: 'song.html',
      template: './src/song.html',
      favicon: './favicon.png',
      chunks: ['songcss', 'song'],
      inject: 'true',
      hash: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'admin.html',
      template: './src/admin.html',
      favicon: './favicon.png',
      chunks: ['admincss', 'admin'],
      inject: 'true',
      hash: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      favicon: './favicon.png',
      chunks: ['indexcss', 'index'],
      inject: 'true',
      hash: true,
    }),
  ]
};

