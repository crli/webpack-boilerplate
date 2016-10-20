const webpack = require('webpack');
const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
//定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
module.exports = {
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    port: 8080
  },
  //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    APP_PATH
  ],
  //输出的文件名 合并以后的js会命名为bundle.js
  output: {
    path: BUILD_PATH,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    perLoaders: [
      {
        test: /\.jsx?$/,
        include: APP_PATH,
        loader: 'jshint-loader'
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: APP_PATH,
        query: {
          presets: ['es2015']
        }
      },
      { 
        test: /\.css$/, 
        include: APP_PATH, 
        loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["last 2 version"]}' 
      },
      { 
        test: /\.scss$/, 
        include: APP_PATH, 
        loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["last 2 version"]}!sass-loader?outputStyle=expanded'
      },
      { 
        test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/, 
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.html$/,
        loader: "html"
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
  //添加我们的插件 会自动生成一个html文件
  plugins: [
    new HtmlwebpackPlugin({
      title: 'Hello',
      template: 'app/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new OpenBrowserPlugin({ url: 'http://localhost:8080' })
  ]
}