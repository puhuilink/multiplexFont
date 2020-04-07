import Vue from 'vue'
import { logout } from '@/api/login'
import { info } from '@/mock/services/user'
import { ACCESS_TOKEN, USER } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { login } from '@/api/controller/User'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    userId: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_ID: (state, { userId }) => {
      state.userId = userId
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          Vue.ls.set(ACCESS_TOKEN, response.data.token, 7 * 24 * 60 * 60 * 1000)
          Vue.ls.set(USER, response.data)
          commit('SET_TOKEN', response.data.token)
          commit('SET_ID', response.data)
          commit('SET_NAME', { name: response.data.staffName, welcome: welcome() })
          commit('SET_AVATAR', '/avatar.jpg')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          // TODO: 此处为 mock 数据，新系统权限部分还未涉及，目前完成了登录接口
          const response = info()
          // const response= await getInfo()
          const result = response.result

          if (result.role && result.role.permissions.length > 0) {
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          const user = Vue.ls.get(USER)
          commit('SET_NAME', { name: user.staffName, welcome: welcome() })
          commit('SET_AVATAR', '/avatar.jpg')

          resolve(response)
        } catch (e) {
          reject(e)
        }
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          Vue.ls.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user
