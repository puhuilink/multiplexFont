export const CacheMutationTypes = {
  setDictValueTreeData: '更新品牌设备缓存'
}

export default {
  state: {
    dictValueTreeData: []
  },
  mutations: {
    [CacheMutationTypes.setDictValueTreeData] (state, { dictValueTreeData = [] }) {
      state.dictValueTreeData = dictValueTreeData
    }
  }
}
