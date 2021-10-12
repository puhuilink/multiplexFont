const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining', // 可选链
    '@babel/plugin-proposal-nullish-coalescing-operator', // 双问号
    ...IS_PROD ? ['transform-remove-console'] : [],
    '@babel/plugin-transform-modules-commonjs',
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
