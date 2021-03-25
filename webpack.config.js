const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const useSourceMaps = !isProduction;
const useVersioning = true;

const babelLoader = {
    loader: 'babel-loader',
    //This option will allow cache results and compile files which are new & changed
    options: {
        cacheDirectory: true
    }
};

const styleLoader = {
    loader: 'style-loader',
    options: {
        sourceMap: useSourceMaps
    }
};

const cssLoader = {
    loader: 'css-loader',
    options: {
        sourceMap: useSourceMaps,
        minimize: isProduction
    }
};

const sassLoader = {
    loader: 'sass-loader',
    options: {
        sourceMap: true
    }
};

const resolveUrlLoader = {
    loader: 'resolve-url-loader',
    options: {
        sourceMap: useSourceMaps
    }
};

const fileLoader = {
    loader: 'file-loader',
    //We can persist original name of files
    options: {
        name: '[name]-[hash:6].[ext]'
    }
};

const webpackConfig = {
    // mode: 'development',//This is used for webpack 4
    entry: {
        rep_log: './assets/js/rep_log.js',
        login: './assets/js/login.js',
        layout: './assets/js/layout.js',
    },
    output: {
        path: path.resolve(__dirname, 'web', 'build'),
        filename: useVersioning ? '[name].[hash:6].js': '[name].js',
        publicPath: "/build/"
    },
    module: {
        rules: [
            //Asking webpack to pass all files end with js through babel-loader
            {
                test: /\.js$/,
                //Skip all files from node_modules
                exclude: /node_modules/,
                use: [babelLoader]
            },
            //Asking webpack to pass all files end with css through css-loader
            {
                test: /\.css$/,
                //if there is no need to supply option, we can declare loaders in the form of an array
                //loaders execute from right to left. css-loader will pass its output as input to style-loader
                use: [styleLoader, cssLoader]
            },
            {
                test: /\.scss$/,
                use: [styleLoader, cssLoader, resolveUrlLoader, sassLoader]
            },
            //Asking webpack to pass all image & font files through file-loader
            {
                test: /\.(png|jpe?g|gif|ico|svg)$/i,
                use: [fileLoader],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                use: [fileLoader],
            },
        ]
    },
    plugins: [
        // This will inject jquery from node_modules to jQuery & $ variables, when ever jQuery is called in js modules
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new CopyPlugin([
            {from: './assets/static', to: 'static'}
        ]),
        //Include vendor.js on base page
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: 2
        }),
        new ManifestPlugin({
            writeToFileEmit: true,
            basePath: 'build/'
        })
    ],
    devtool: useSourceMaps ? 'inline-source-map': false
};

if(isProduction){
    webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );
    //This plugin will pass minimize and debug options to all loaders
    webpackConfig.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        })
    );
    webpackConfig.plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    );
}

module.exports = webpackConfig;
