export const CacheMutationTypes = {
  setDictValueTreeData: '更新品牌设备缓存',
  setViews: '更新视图缓存',
  setORM: '更新视图可变量缓存'
}

export default {
  state: {
    dictValueTreeData: [],
    views: {},
    // 缓存key切换视图数据源
    orm: []
  },
  mutations: {
    [CacheMutationTypes.setORM] (state, [label, id]) {
      state.orm = [label, id]
    },
    [CacheMutationTypes.setDictValueTreeData] (state, { dictValueTreeData = [] }) {
      state.dictValueTreeData = dictValueTreeData
    },
    [CacheMutationTypes.setViews] (state, { views }) {
      state.views = views
    }
  }
}
