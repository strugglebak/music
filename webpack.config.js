const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    admincss: path.resolve(__dirname, './src/js/admin/admin.css.js'),
    admin: path.resolve(__dirname, './src/js/admin/admin.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
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
        use: ['style-loader',
          {
            loader: 'css-loader',
          }
        ]
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
    new webpack.ProvidePlugin({
      AV: 'leancloud-storage',
      plupload: 'plupload',
      Qiniu: path.resolve(path.join(__dirname, 'node_modules/my-qiniu-js/src/qiniu.js')),
      $: 'jquery',
    }),
    new HtmlWebpackPlugin({
      filename: 'admin.html',
      template: './src/admin.html',
      favicon: './favicon.png',
      chunks: ['admincss', 'admin'],
      inject: 'true',
      hash: true,
    }),
  ]
};

