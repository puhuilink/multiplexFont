export const AlertMutationTypes = {
  setPlatformList: '更新接入平台列表',
  setViews: '更新视图缓存',
  setORM: '更新视图可变量缓存'
}

export default {
  state: {
    platformList: []
  },
  mutations: {
    [AlertMutationTypes.setPlatformList] (state, { platformList = [] }) {
      state.platformList = platformList
    }
  }
}
