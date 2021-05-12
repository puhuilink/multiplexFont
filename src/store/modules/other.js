export const OtherMutationTypes = {
  setExpectDate: '更新计划管理排除日期'
}

export default {
  state: {
    date: []
  },
  mutations: {
    setExpectDate (state, payload) {
      state.date = payload
    }
  }
}
