const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const projectName = 'panorama'

module.exports = {
  // 基本路径
  // baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
  publicPath: `/${projectName}/`,
  // 输出文件目录
  outputDir: projectName,
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {
    config.resolve.symlinks(true)
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('api', resolve('src/api'))
  },
  configureWebpack: () => {},
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    // extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      sass: {
        data: '@import "@/style/index.scss";'
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: true, //配置自动启动浏览器
    host: 'localhost',
    port: 8866, // 端口号
    https: false,
    hot: true,
    hotOnly: false, // https:{type:Boolean}
    disableHostCheck: true,
    // proxy: null,                                // 设置代理
    // proxy: 'http://localhost:4000'           // 配置跨域处理,只有一个代理
    // proxy: {                                 // 配置多个代理
    //     '/api': {
    //         target: '<url>',
    //         ws: true,
    //         changeOrigin: true
    //     },
    //     '/foo': {
    //         target: '<other_url>'
    //     }
    // }
    historyApiFallback: {
      rewrites: [
        {
          from: /^.*/,
          to: `/${projectName}/`
        }
      ]
    }
  },

  // 第三方插件配置
  pluginOptions: {}
}
