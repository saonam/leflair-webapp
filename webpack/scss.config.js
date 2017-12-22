var webpack = require('webpack');
var path = require('path');
const { sassResourcesLoader } = require('./common.config.js');

module.exports = {
    entry: [
        `${__dirname}/../src/client/index.tsx`
    ],
    output: {
        filename: 'server.js',
        path: `${__dirname}/../dist`
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.s?css$/,
                loaders: [
                    'typings-for-css-modules-loader?namedExport&camelCase&modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    'sass-loader?sourceMap',
                    sassResourcesLoader
                ]
            },
            {
                test: /\.tsx?$/,
                loaders: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            ignoreDiagnostics: [2307]
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    }
};
