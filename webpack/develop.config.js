var webpack = require('webpack');
var path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const { sassResourcesLoader } = require('./common.config.js');

module.exports = {
    devServer: {
        /* Currently not working: https://github.com/webpack/webpack-dev-server/issues/944
        allowedHosts: [
            'www.leflair.dev'
        ],*/
        host: "0.0.0.0",
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                secure: false
            }
        },
        historyApiFallback: {
            index: 'index.html'
        },
        contentBase: `${__dirname}/assets`,
        disableHostCheck: true
    },
    devtool: 'source-map',
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'react-hot-loader/patch',
        `${__dirname}/../src/client/index.tsx`
    ],
    output: {
        filename: 'bundle.js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    plugins: [
        new CheckerPlugin(),
        new webpack.NamedModulesPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.s?css$/,
                loaders: [
                    'style-loader',
                    'typings-for-css-modules-loader?namedExport&camelCase&modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    'sass-loader?sourceMap',
                    sassResourcesLoader
                ]
            },
            {
                test: /\.tsx?$/,
                loaders: ['awesome-typescript-loader'],
                exclude: /node_modules/
            }
        ]
    }
};
