const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: {
        pagescript: './src/js/pagescript.js',
        popup: './src/js/popup.js',
        background: './src/js/background.js',
        // options: './src/js/options.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build')
    },
    resolve: {
        extensions: ['.js', '.css', '.scss', '.json']
    },
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src'],
                    }
                }
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            }
        ],
    },
    optimization: {
      splitChunks: {
          chunks: "all",
          cacheGroups: {
              commons: {
                  name: 'commons',
                  chunks: 'initial',
                  minChunks: 2
              }
          }
      }
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        new webpack.EnvironmentPlugin({
            GA_TRACKING_ID: 'UA-138677716-1',
        }),
        new CopyWebpackPlugin([{
            from: "src/manifest.json",
            transform: function (content, path) {
                return Buffer.from(JSON.stringify({
                    version: process.env.npm_package_version,
                    ...JSON.parse(content.toString())
                }))
            },
            to: './manifest.json',
        }, {
            from: 'src/icon', to: 'icon',
        }
        ]),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "popup.html"),
            filename: "popup.html",
            chunks: ["popup"]
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "libplus-page.html"),
            filename: "libplus-page.html",
            chunks: ["libplus-page"]
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "background.html"),
            filename: "background.html",
            chunks: ["background"]
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "options.html"),
            filename: "options.html",
            chunks: ["options"]
        }),
    ],
};
