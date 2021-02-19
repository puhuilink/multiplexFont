export const CacheMutationTypes = {
  setDictValueTreeData: '更新品牌设备缓存',
  setViews: '更新视图缓存'
}

export default {
  state: {
    dictValueTreeData: [],
    views: {}
  },
  mutations: {
    [CacheMutationTypes.setDictValueTreeData] (state, { dictValueTreeData = [] }) {
      state.dictValueTreeData = dictValueTreeData
    },
    [CacheMutationTypes.setViews] (state, { views }) {
      state.views = views
    }
  }
}
