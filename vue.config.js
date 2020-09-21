const path = require('path')
const webpack = require('webpack')
const createThemeColorReplacerPlugin = require('./config/plugin.config')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const childProcess = require('child_process')

function resolve (dir) {
  return path.join(__dirname, dir)
}

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/components/global.less')
      ]
    })
}

const {
  NODE_ENV,
  VUE_APP_API_BASE_URL,
  VUE_APP_API_BASE_URL_ORIGINAL_URL,
  VUE_APP_HASURA_MAIN_URI,
  VUE_APP_HASURA_MAIN_ORIGINAL_URL,
  VUE_APP_VIEW_THUMBNAIL_URI,
  VUE_APP_VIEW_THUMBNAIL_ORIGINAL_URL
} = process.env

const isProd = NODE_ENV === 'production'

const assetsCDN = {
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  js: [
    '//unpkg.com/vue@2.6.10/dist/vue.min.js',
    '//unpkg.com/vue-router@3.1.3/dist/vue-router.min.js',
    '//unpkg.com/vuex@3.1.1/dist/vuex.min.js',
    '//unpkg.com/axios@0.19.0/dist/axios.min.js'
  ]
}

// vue.config.js
const vueConfig = {
  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      createThemeColorReplacerPlugin()
    ],
    externals: {
      ace: 'ace',
      ...isProd ? assetsCDN.externals : {}
    }
  },

  chainWebpack: (config) => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))

    config.resolve.alias
      .set('@$', resolve('src'))
      .set('~~~', resolve('src/components'))

    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end()

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })

    // 20 kb 以内图片采用 url-loader (项目中大部分图都在该范围内)
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 20480 }))
      .end()

    if (isProd) {
      // 在 html 中打上版本号
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        args[0].version = {
          commit: childProcess.execSync('git rev-parse HEAD', { encoding: 'utf8' }),
          date: new Date(childProcess.execSync(`git show -s --format=%cd`, { encoding: 'utf8' })),
          branch: childProcess.execSync('git symbolic-ref --short HEAD', { encoding: 'utf8' })
        }
        return args
      })
    }

    config.plugin('lodashReplace').use(new LodashModuleReplacementPlugin({
      shorthands: true,
      // https://github.com/ant-design/ant-design/issues/3794
      paths: true
    }))
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 'primary-color': '#F5222D'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 8080,
    proxy: {
      // 后台接口
      [VUE_APP_API_BASE_URL]: {
        target: VUE_APP_API_BASE_URL_ORIGINAL_URL,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          [VUE_APP_API_BASE_URL]: ''
        }
      },
      // hasura main
      [VUE_APP_HASURA_MAIN_URI]: {
        target: VUE_APP_HASURA_MAIN_ORIGINAL_URL,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          [VUE_APP_HASURA_MAIN_URI]: ''
        }
      },
      // 视图缩略图 nginx 静态资源目录
      [VUE_APP_VIEW_THUMBNAIL_URI]: {
        target: VUE_APP_VIEW_THUMBNAIL_ORIGINAL_URL,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          [VUE_APP_VIEW_THUMBNAIL_URI]: ''
        }
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: 'warning',
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

module.exports = vueConfig
