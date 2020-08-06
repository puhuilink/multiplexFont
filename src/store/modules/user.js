import Vue from 'vue'
import { logout } from '@/api/login'
import { getGroupPermission } from '@/api/system'
import { decrypt } from '@/utils/aes'
import { ACCESS_TOKEN, USER } from '@/store/mutation-types'
import { welcome, getTree, getButtonTree } from '@/utils/util'
import { login } from '@/api/controller/User'
import router from '@/router'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    userId: '',
    userOriginalPermission: null
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
          // const res = JSON.parse(decrypt(response.data))
          const data = JSON.parse(decrypt(response.data))
          Vue.ls.set(ACCESS_TOKEN, data.token, 7 * 24 * 60 * 60 * 1000)
          Vue.ls.set(USER, data)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo ({ commit, dispatch }) {
      return new Promise(async (resolve, reject) => {
        try {
          const user = Vue.ls.get(USER)
          const originalPermission = []
          const organizeList = (user.organizeList || []).filter(v => !!v)
          if (!organizeList.length) {
            reject(new Error('该用户未分配工作组，请先联系管理员分配工作组！'))
          }
          const results = await Promise.all(user.organizeList.map(organize => getGroupPermission(organize.groupId)))
          const status = results.map(result => result.code === 200).reduce((pre, cur) => pre && cur)
          const permissionList = results.flatMap(item => item.data)
          if (!status) {
            reject(new Error('用户权限数据获取失败，请稍后尝试！'))
          }
          permissionList.forEach(permission => {
            if (!originalPermission.some(item => item.code === permission.code)) {
              originalPermission.push(permission)
            }
          })
          // 菜单权限列表
          const menuOriginalPermission = originalPermission.filter(item => /^F/.test(item.code))
          // 按钮权限列表
          const buttonOriginalPermission = originalPermission.filter(item => /^M/.test(item.code))

          const buttonTree = getButtonTree(null, buttonOriginalPermission)
          const permissionTree = getTree(null, menuOriginalPermission, buttonTree)
          const userPermission = Object.assign({}, user, permissionTree)

          if (userPermission.permissions && userPermission.permissions.length > 0) {
            commit('SET_ROLES', userPermission)
            commit('SET_INFO', {
              ...userPermission,
              ...user
            })
          } else {
            reject(new Error('用户或其工作组未分配可访问的权限！'))
          }

          // TODO: 此处为 mock 数据，新系统权限部分还未涉及，目前完成了登录接口
          // const response = info()
          // // const response= await getInfo()
          // const result = response.result
          //
          // if (result.role && result.role.permissions.length > 0) {
          //   const role = result.role
          //   role.permissions = result.role.permissions
          //   role.permissions.map(per => {
          //     if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
          //       const action = per.actionEntitySet.map(action => { return action.action })
          //       per.actionList = action
          //     }
          //   })
          //   role.permissionList = role.permissions.map(permission => { return permission.permissionId })
          //   console.log('role: ', result.role)
          //   commit('SET_ROLES', result.role)
          //   commit('SET_INFO', {
          //     ...result,
          //     ...user
          //   })
          // } else {
          //   reject(new Error('getInfo: roles must be a non-null array !'))
          // }

          commit('SET_TOKEN', user.token)
          commit('SET_ID', user)
          commit('SET_NAME', { name: user.staffName, welcome: welcome() })
          commit('SET_AVATAR', '/avatar.jpg')

          resolve(userPermission)
        } catch (e) {
          reject(e)
        }
      })
    },

    // 登出
    Logout ({ commit, state }) {
      // TODO: 当前 token 并无过期时间，后端也并未提供 logout 接口
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          Vue.ls.remove(ACCESS_TOKEN)
          router.push('/user/login')
        })
      })
    }

  }
}

export default user
