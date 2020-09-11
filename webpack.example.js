const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './example/index',
  mode: 'development',
  resolve: {
    alias: {
      'media-overlay-library$': path.resolve(__dirname, 'lib'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            sourceType: 'unambiguous',
            presets: [
              '@babel/preset-typescript',
              '@babel/preset-react',
              [
                '@babel/preset-env',
                {
                  debug: false,
                },
              ],
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
            ],
            babelrc: false,
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'example/template.html',
    }),
  ],
}
