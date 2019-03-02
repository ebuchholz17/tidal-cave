var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var WriteFilePlugin = require("write-file-webpack-plugin");
var path = require("path");

module.exports = {
    entry: "main",
    output: {
        filename: "[name].min.js",
        path: path.join(__dirname, "./dist")
    },
    module: {
        rules: [
            { test: /\.txt$/, loader: "raw-loader" }
        ]
    },
    plugins: [
        new WriteFilePlugin(),
        new CopyWebpackPlugin([
            {
                from: "src/assets",
                to: "assets",
            },
            {
                from: "src/css",
                to: "css",
            },
            {
                from: "src/index.html",
                to: "index.html",
            }
        ])
    ],
    resolve: {
        extensions: [
            ".js",
            ".txt"
        ],
        modules: [
            "src",
            "src/js",
            "node_modules",
        ]
    },
    devtool: "source-map"
};
