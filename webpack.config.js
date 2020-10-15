const path = require('path');
const { EnvironmentPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { ENVIRONMENT } = process.env;

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, './build')
    },
    plugins: [
        new EnvironmentPlugin({
            ENVIRONMENT
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public',
                    to: 'public'
                }
            ]
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        }),
        new GenerateSW({
            skipWaiting: true,
            clientsClaim: true,
            maximumFileSizeToCacheInBytes: 99999999,
            exclude: [/\.DS_Store/]
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'ts-loader']
            },
            {
                test: /\.js(x?)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    optimization: {
        // Separate runtime code into a runtime chunk
        runtimeChunk: 'single',
        // Separate dependencies into a vendors chunk
        splitChunks: {
            chunks: 'all'
        }
    },
    devServer: {
        overlay: true,
        stats: 'minimal',
        host: '0.0.0.0',
        disableHostCheck: true
    }
};
