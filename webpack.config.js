const webpack = require('webpack');
const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  devServer: {
    hot: true,
    inline: true,
    progress: true,
    host: '0.0.0.0',
    port: 7080
  },
  //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:7080',
     path.resolve(__dirname, 'app/index.js')
  ],
  //输出的文件名 合并以后的js会命名为bundle.js
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    perLoaders: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'app'), 
        loader: 'jshint-loader'
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      { 
        test: /\.css$/, 
        loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["last 2 version"]}' 
      },
      { 
        test: /\.scss$/, 
        include: path.resolve(__dirname, 'app'), 
        loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["last 2 version"]}!sass-loader?outputStyle=expanded'
      },
      { 
        test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/, 
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      }
    ]
  },
  //检查自己的js是否符合jshint的规范
  jshint: {
    "esnext": true
  },
  //合并以后的代码，采用source-map的形式利于排错和定位
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['', '.js'],
  },

  plugins: [
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
    }),
    new HtmlwebpackPlugin({
      title: 'Hello World app',
      template: path.resolve(__dirname, 'app/index.html'),
      filename: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new OpenBrowserPlugin({ url: 'http://localhost:7080' })
  ]
}