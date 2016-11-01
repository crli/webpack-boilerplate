var path = require('path');
var webpack = require('webpack');
var validate = require('webpack-validator');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Merge = require('webpack-merge');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

/*
 *  Detect how npm is run and branch based on that
 * */
var currentTarget = process.env.npm_lifecycle_event;

var debug,          // is debug
    devServer,      // is hrm mode
    minimize;       // is minimize


if (currentTarget == "build") { // online mode 

    debug = false, devServer = false, minimize = true;

} else if (currentTarget == "dev") { // dev mode 

    debug = true, devServer = false, minimize = false;

} else if (currentTarget == "start") { // dev HRM mode 

    debug = true, devServer = true, minimize = false;
}

    
var PATHS = {
    /*
     * publish path
     * */
    publicPath: devServer ? '/h5mobile/dist/' : './',


    /*
     * public resource path
     * */
    libsPath: path.resolve(process.cwd(), './src/libs'),

    /*
     * resource path
     * */
    srcPath: path.resolve(process.cwd(), './src'),

    /*
    * node_modules path
    */
    node_modulesPath: path.resolve('./node_modules'),
}


var resolve = {
    extensions: ['', '.js', '.css', '.scss', '.png', '.jpg'],

    /*
     * The directory (absolute path) that contains your modules
     * */
    root: [
        PATHS.node_modulesPath
    ],

    /*
     * Replace modules with other modules or paths.
     * */
    alias: {
        /*
         * js
         */
        jquery: path.join(PATHS.libsPath, "js/jquery"),
        fullPage: path.join(PATHS.libsPath, "js/jquery.fullPage.js"),
        /*
         * css
         */
        fcss : path.join(PATHS.libsPath, "css/jquery.fullPage.css"),
        indexcss: path.join(PATHS.srcPath, "css/index.scss"),
    }
}

/*
 * The entry point for the bundle.
 * */
var entry = {
    index: './src/index.js',
    common: [
        path.join(PATHS.libsPath, "js/jquery"),
        path.join(PATHS.libsPath, "js/jquery.fullPage.js")
    ],
};


/*
 * output options tell Webpack how to write the compiled files to disk
 * */
var output = {
    /*
     *  determines the location on disk the files are written to
     * */
    path: path.join(__dirname, 'dist'),

    /*
     * The publicPath specifies the public URL address of the output files when referenced in a browser
     * */
    publicPath: PATHS.publicPath,

    /*
     * Specifies the name of each output file on disk
     * */
    filename: devServer ? 'js/[name].js' : 'js/[name]-[chunkhash:8].js',

    /*
     * The filename of non-entry chunks as relative path inside the output.path directory.
     * （按需加载模块时输出的文件名称）
     * */
    chunkFilename: devServer ? 'js/[name].js' : 'js/[name]-[chunkhash:8].js'
}

var loaders = [
    
    {
        test: /\.js$/,
        loader: 'babel'
    },

    {
        test: /\.html$/,
        loader: "html"
    },

    {
        test: /\.(png|gif|jpe?g)$/,
        loader: 'url-loader',
        query: {
            limit: 10000,
            name: 'imgs/[name]-[hash:8].[ext]'
        }
    },

    {
       test   : /\.woff|\.woff2|\.svg|.eot|\.ttf/,
       loader : 'url-loader?prefix=font/&limit=10000'
    },

    {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader", {
            publicPath: '../'
        })
    },

    { 
        test: /\.scss$/, 
        loader:ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!sass-loader?outputStyle=expanded", {
            publicPath: '../'
        })
    }


];

var plugins = [

    new webpack.DefinePlugin({
        /*
         * dev flag
         * （开发标识）
         * */
        __DEV__: debug,
    }),


    new webpack.optimize.CommonsChunkPlugin(
        devServer ?
        {name: "common", filename: "js/common.js"}:
        {names: ["common", "webpackAssets"]}
    ),

    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
    }),

    /*
     * Search for equal or similar files and deduplicate them in the output
     */
    new webpack.optimize.DedupePlugin(),

    /*
     * Using this config the vendor chunk should not be changing its hash unless you change its code or dependencies
     * （避免在文件不改变的情况下hash值不变化）
     * */
    new webpack.optimize.OccurenceOrderPlugin(),

    new CleanWebpackPlugin(['dist'], {
        root: '', // An absolute path for the root  of webpack.config.js
        verbose: true,// Write logs to console.
        dry: false // Do not delete anything, good for testing.
    }),

    new ExtractTextPlugin(devServer ? "css/[name].css" : "css/[name]-[chunkhash:8].css",{allChunks: true}),

    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: __dirname + '/src/index.html',
        /*
         * inject: true | 'head' | 'body' | false Inject all assets into the given template or templateContent -
         * When passing true or 'body' all javascript resources will be placed at the bottom of the body element.
         * 'head' will place the scripts in the head element.
         * */
        inject: 'true',

        // 需要依赖的模块
        chunks: ['common', 'index', 'webpackAssets'],

        // 根据依赖自动排序
        // chunksSortMode: 'dependency'
    })
];


if (minimize) {

    plugins.push(

        new webpack.optimize.UglifyJsPlugin({ // js、css
            mangle: {
                except: ['$super', '$', 'exports', 'require', 'module', '_']
            },
            compress: {
                warnings: false
            },
            output: {
                comments: false,
            }
        })
    )

}


var config = {
    entry: entry,
    /*
     *  Like resolve but for loaders(find the position of loader).
     * */
    resolveLoader: {root: path.join(__dirname, "node_modules")},
    output: output,
    module: {
        loaders: loaders
    },
    resolve: resolve,
    plugins: plugins,

}


/*
 *  Hrm setting
 * */
if (devServer) {

    config = Merge(
        config,
        {
            plugins: [
                // Enable multi-pass compilation for enhanced performance
                // in larger projects. Good default.
                new webpack.HotModuleReplacementPlugin({
                    multiStep: true
                }),
                new OpenBrowserPlugin({url: 'http://localhost:8080' + PATHS.publicPath + 'index.html'})
            ],
            devServer: {
                // Enable history API fallback so HTML5 History API based
                // routing works. This is a good default that will come
                // in handy in more complicated setups.
                historyApiFallback: true,

                // Unlike the cli flag, this doesn't set
                // HotModuleReplacementPlugin!
                hot: true,
                inline: true,

                // Display only errors to reduce the amount of output.
                stats: 'errors-only',

                // Parse host and port from env to allow customization.
                //
                // If you use Vagrant or Cloud9, set
                // host: options.host || '0.0.0.0';
                //
                // 0.0.0.0 is available to all network devices
                // unlike default `localhost`.
                host: "localhost", // Defaults to `localhost`   process.env.HOST
                port: "8080"  // Defaults to 8080   process.env.PORT
                
            }
        }
    );
}

module.exports = validate(config);






