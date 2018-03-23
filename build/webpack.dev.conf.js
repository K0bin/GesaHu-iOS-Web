const path = require('path');
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}


module.exports = {
  entry: './src/app.ts',
  //devtool: 'inline-source-map',
  devtool: 'source-map',
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.vue' ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'framework7$': 'framework7/dist/framework7.esm.bundle.js',
      '@': resolve('src')
    }
  },
  output: {
    filename: 'app.js',
    path: resolve('dist'),
    //publicPath: ''
  },
  //context: __dirname + '/../',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
            appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
            resolve('node_modules/webpack-dev-server/client'),
            resolve('node_modules/framework7'),
            resolve('node_modules/framework7-vue'),
            resolve('node_modules/template7'),
            resolve('node_modules/dom7'),
        ]
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: './img/[name].[ext]',
          publicPath: 'img/',
          outputPath: resolve('img')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[name].[ext]',
          publicPath: 'font/',
          outputPath: resolve('font')
        }
      },
      {
          test: /\.(html)$/,
          loader: 'file-loader',
          options: {
              name: '[name].[ext]'
          },
          include: [
              resolve('static')
          ]
      }
      /*{
        test: /\.(html)$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                loader: 'extract-loader'
            },
            {
                loader: 'html-loader',
                options: {
                  minimize: true
                }
            }
        ],
        include: [
            resolve('static')
        ]
      }*/
    ]
  },
  devServer: {
    contentBase: './dist/',
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};