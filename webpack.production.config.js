const webpack = require('webpack');
const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {

  //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
  entry: path.resolve(__dirname, 'app/index.js'),//单文件

  // entry: {
  //  //三个入口文件，app, mobile和 vendors
  //   app: path.resolve(__dirname, 'app/index.js'),
  //   mobile: path.resolve(__dirname, 'app/mobile.js'),
  //   vendors: ['jquery']
  // },
  //单文件输出的文件名 合并以后的js会命名为bundle.js
  output: {
    path: __dirname + '/build',
    filename: '[hash].bundle.js'
  },
  // output: {
  //   path: __dirname + '/build',
  //   filename: '[name].[hash].js'
  // },
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
        loader: "html"
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  //添加我们的插件 会自动生成一个html文件
  //多页面打包
  plugins: [
    //这个使用uglifyJs压缩你的js代码
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    // //把入口文件里面的数组打包成verdors.js
    // new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    // //创建了两个HtmlWebpackPlugin的实例，生成两个页面
    // new HtmlwebpackPlugin({
    //   title: 'Hello World app',
    //   template: path.resolve(__dirname, 'app/templates/index.html'),
    //   filename: 'index.html',
    //   //chunks这个参数告诉插件要引用entry里面的哪几个入口
    //   chunks: ['app', 'vendors'],
    //   //要把script插入到标签里
    //   inject: 'body'
    // }),
    // new HtmlwebpackPlugin({
    //   title: 'Hello Mobile app',
    //   template: path.resolve(__dirname, 'app/templates/mobile.html'),
    //   filename: 'mobile.html',
    //   chunks: ['mobile', 'vendors'],
    //   inject: 'body'
    // })
    new HtmlwebpackPlugin({
      title: 'Hello World app',
      template: path.resolve(__dirname, 'app/index.html'),
      filename: 'index.html',
    }),
  ]
}
