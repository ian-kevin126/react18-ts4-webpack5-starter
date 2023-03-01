import path from 'path'
import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import CopyPlugin from 'copy-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import baseConfig from './webpack.base'

// const globAll = require('glob-all')
const glob = require('glob')
// 注意这里的引用是{ PurgeCSSPlugin }，npm上官方的引入是错误的。
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')

const prodConfig: Configuration = merge(baseConfig, {
  mode: 'production', // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
  /**
   * 打包环境推荐：none(就是不配置devtool选项了，不是配置devtool: 'none')
   * ● none话调试只能看到编译后的代码,也不会泄露源代码,打包速度也会比较快。
   * ● 只是不方便线上排查问题, 但一般都可以根据报错信息在本地环境很快找出问题所在。
   */
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'), // 复制public下文件
          to: path.resolve(__dirname, '../dist'), // 复制到dist目录中
          filter: source => !source.includes('index.html') // 忽略index.html
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css', // 抽离css的输出目录和名称
      chunkFilename: 'static/css/[name].[contenthash:8].css'
    }),
    // 清理无用css，检测src下所有tsx文件和public下index.html中使用的类名和id和标签名称
    // 只打包这些文件中用到的样式
    // new PurgeCSSPlugin({
    //   paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    // }),
    new PurgeCSSPlugin({
      // paths: globAll.sync(
      //   [`${path.join(__dirname, '../src')}/**/*`, path.join(__dirname, '../public/index.html')],
      //   {
      //     nodir: true
      //   }
      // ),
      paths: glob.sync(`${path.join(__dirname, '../src')}/**/*`, {
        nodir: true
      }),
      // 用 only 来指定 purgecss-webpack-plugin 的入口
      // https://github.com/FullHuman/purgecss/tree/main/packages/purgecss-webpack-plugin
      only: ['dist'],
      safelist: {
        standard: [/^ant-/] // 过滤以ant-开头的类名，哪怕没用到也不删除
      }
    }),
    // 打包时生成gzip文件
    new CompressionPlugin({
      test: /\.(js|css)$/, // 只生成css,js压缩文件
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式,默认是gzip
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8 // 压缩率,默认值是 0.8
    })
  ],
  optimization: {
    // 减少入口文件打包的体积，运行时代码会独立抽离成一个runtime的文件
    runtimeChunk: {
      name: 'mainifels'
    },
    // 还要在 package.json 中配置 "sideEffects": false,
    // sideEffects: true, // 开启sideEffects
    // usedExports: true,
    minimize: true, // 开启terser
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin({
        parallel: true, // 开启多线程压缩
        extractComments: false, // 是否将注释剥离到单独文件，默认是true
        terserOptions: {
          output: {
            comments: false,
            ecma: 5
          },
          sourceMap: true,
          mangle: true,
          compress: {
            ecma: 5,
            keep_fargs: false,
            pure_getters: true,
            hoist_funs: true,
            pure_funcs: [
              'console.log',
              'classCallCheck',
              '_classCallCheck',
              '_possibleConstructorReturn',
              'Object.freeze',
              'invariant',
              'warning'
            ] // 删除console.log
          }
        }
      })
    ],
    splitChunks: {
      // include all types of chunks 支持异步和非异步共享chunk
      chunks: 'all',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      // 分隔代码
      cacheGroups: {
        vendors: {
          // 提取node_modules代码
          test: /node_modules/, // 只匹配node_modules里面的模块
          // name: 'vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加，可以不要定义固定的name
          minChunks: 1, // 只要使用一次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
          enforce: true,
          reuseExistingChunk: true,
          priority: 10 // 提取优先级为1
        },
        commons: {
          // 提取页面公共代码
          name: 'commons', // 提取文件命名为commons
          minChunks: 2, // 只要使用两次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          priority: 0, // 优先级
          enforce: true,
          reuseExistingChunk: true,
          minSize: 0 // 提取代码体积大于0就提取出来
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  performance: {
    hints: false,
    maxAssetSize: 4000000, // 整数类型（以字节为单位）
    maxEntrypointSize: 5000000 // 整数类型（以字节为单位）
  }
})

export default prodConfig
