const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/init.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // {
      //   test: /\.(scss)$/,
      //   use: [{
      //     loader: 'style-loader', // inject CSS to page
      //   }, {
      //     // Interprets `@import` and `url()` like `import/require()` and will resolve them
      //     loader: 'css-loader', // translates CSS into CommonJS modules
      //   }, {
      //     loader: 'postcss-loader', // Run post css actions
      //     options: {
      //       plugins: function () { // post css plugins, can be exported to postcss.config.js
      //         return [
      //           require('precss'),
      //           require('autoprefixer')
      //         ];
      //       }
      //     }
      //   }, {
      //     loader: 'sass-loader', // compiles Sass to CSS
      //   }],
      // },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'template.html',
    }),
  ],
};
