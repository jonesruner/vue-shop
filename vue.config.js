// 修改默认 Webpack 配置
module.exports = {
  // 修改入口文件配置
  chainWebpack: config => {
    //   发布
    config.when(process.env.NODE_ENV === 'production', config => {
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')
    })
    // 开发
    config.when(process.env.NODE_ENV === 'development', config => {
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')
    })
  }
}
