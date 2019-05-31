const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WriteFilePlugin = require("write-file-webpack-plugin");

module.exports = merge(common, {
    mode: 'development',
    devtool: "cheap-module-eval-source-map",
    devServer: {
        contentBase: './src',
        hot: true,
        port: 3001,
        disableHostCheck: true,
        writeToDisk: true,
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
            PORT: '3001',
        }),
        new webpack.HotModuleReplacementPlugin(),
        new WriteFilePlugin(),
    ],
});
