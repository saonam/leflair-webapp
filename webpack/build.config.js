const webpack = require('webpack');
const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const CompressionPlugin = require('compression-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { sassResourcesLoader } = require('./common.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const nodeExternals = require('webpack-node-externals'); // Exclude node_modules from bundling for server-side rendering (related to hooking redis)

const serverConfig = {
    target: 'node',
    externals: [nodeExternals()],
    node: {
        __dirname: false,
        __filename: false,
    },
    entry: {
        main: `${__dirname}/../src/server/index.tsx`
    },
    output: {
        filename: 'server.js',
        path: `${__dirname}/../dist`
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.s?css$/,
                loader: [
                    'isomorphic-style-loader',
                    'typings-for-css-modules-loader?namedExport&camelCase&modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    'sass-loader?sourceMap',
                    sassResourcesLoader
                ]
            },
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CheckerPlugin(),
        new CopyWebpackPlugin([{
            from: `${__dirname}/assets`,
            to: `${__dirname}/../dist/public`,
            ignore: '**/index.html'
        }])
    ]
};

const clientConfig = {
    entry: [
        './src/client/index.tsx'
    ],
    output: {
        filename: `${process.env.CI_COMMIT_TAG || process.env.CI_COMMIT_SHA}-client.js`,
        path: `${__dirname}/../dist/public`
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.s?css$/,
                loader: ExtractTextPlugin.extract({
                    use: [
                        'typings-for-css-modules-loader?namedExport&camelCase&modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                        'sass-loader?sourceMap',
                        sassResourcesLoader
                    ]
                })
            },
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CheckerPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin("styles.css"),
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: { discardComments: { removeAll: true } }
        }),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new Visualizer({
            filename: `../../webpack/stats.html`
        })
    ]
};

module.exports = [serverConfig, clientConfig];
