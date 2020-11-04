const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    ...IS_PROD ? ['transform-remove-console'] : [],
    [
      'import', {
        'libraryName': 'ant-design-vue',
        'libraryDirectory': 'es',
        'style': 'css' // `style: true` 会加载 less 文件
      },
      'transform-decorators-legacy'
    ],
    'lodash'
  ]
}
