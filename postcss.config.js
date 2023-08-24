module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      'rootValue': 16,
      'propList': ['*'],
      selectorBlackList: ['.ant-header-side-opened', '.ant-header-side-close', '.ant-menu-inline-collapsed', '.logo', '.detail_logo', '.simple_logo', '.ant-breadcrumb-separator']
    }
  }
}
