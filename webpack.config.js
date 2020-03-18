const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: "./src/index.js",
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    publicPath: '/',
    liveReload: true,
    port: 8888
  },
  resolve: {
      alias:{
    
      }
  },
  module:{
    rules:[
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            
     ]
  },
  plugins: [
  //  new ExtractTextPlugin({filename:'app.bundle.css'}),
    new UglifyJsPlugin(),
    new CopyPlugin([
      { from: './src/static', to: "static"},
     // { from: 'CNAME'},
      { from: './src/pages'},
    ])

]
};