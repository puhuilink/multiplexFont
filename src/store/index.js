import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// 动态路由与权限
import permission from './modules/permission'

// 视图设计
import screen from './modules/screen'

import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    screen
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
