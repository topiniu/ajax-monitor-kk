const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");
const rootDir = path.join(__dirname, "..");

module.exports = {
    entry: {
      popup: path.join(srcDir, 'popup.tsx'),
      options: path.join(srcDir, 'options.jsx'),
      background: path.join(srcDir, 'background.js'),
      content: path.join(srcDir, 'content_script.js'),
      main: path.join(srcDir, 'main.jsx'),
      index: path.join(srcDir, 'index.tsx'),
    },
    output: {
        path: path.join(__dirname, "../dist/js"),
        filename: (pathData) => {
            return pathData.chunk.name === 'content' 
            ? '../[name].js'
            : '[name].js';
        },
        // filename: "[name].js",
    },
    optimization: {
        splitChunks: {
            name: "vendor",
            chunks(chunk) {
              return chunk.name !== 'background';
            }
        },
    },
    module: {
      rules: [
        {
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/,
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
            },
          ],
        },
        {
          test: /\.less$/,
        //   include: path.resolve(__dirname, '.'),
          use: [{
            loader: 'style-loader'
          }, {
            loader: 'css-loader?',
          }, {
            loader: 'less-loader?'
          }],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.svg?$/,
          use: [{
            loader: 'svg-loader',
          }]
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: {
            loader: 'file-loader',
            options: {
              esModule: false
            }
          }
        },
        {
          test: /\.ttf$/,
          type: 'asset/resource'
        }]
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: "../", context: "public" }],
            options: {},
        }),
    ],
};
