import { BaseService } from './BaseService'
// import { actionname, moduleName } from '../utils/decorator/log'
import { camelExchange } from '@/utils/util'
import { query, generateQuery, generateMutation } from '../utils/hasura-orm/index'
import {
  AuthorizeObjectDao,
  FunctionDao,
  UserDao,
  UserGroupDao,
  ViewDesktopDao
} from '../dao/index'
import store from '@/store'
import _ from 'lodash'
import { axios, zhenhua } from '@/utils/request'
import { encrypt } from '@/utils/aes'
import { OBJECT_TYPE } from '@/tables/authorize_object/enum'
import Timeout from 'await-timeout'

// @moduleName('用户模块')
class UserService extends BaseService {
  // @actionname('新增用户')
  /**
   * 新增用户
   * @param {Object} user
   * @return {Promise<any>}
   */
  static async add (user = {}) {
    const q = await generateMutation(
      // 新增用户
      UserDao.add(user)
    )
    await this.saveRedis(Object.assign(user, { type: 'insert' }))
    await this.hasuraTransfer({ query: q })
    await UserService.setInitialPwd(user.user_id)
  }

  static async find (argus = {}) {
    const q = await generateQuery(
      UserDao.find(argus)
    )
    return this.hasuraTransfer({ query: q })
  }

  // @actionname('删除用户')
  /**
   * 删除用户
   * @param {Array<String>} userIdList
   * @return {Promise<any>}
   */
  static async batchDelete (userIdList = []) {
    const q = await generateMutation(
    // 删除用户
      UserDao.batchDelete({ user_id: { _in: userIdList } }),
      // 删除用户自定义桌面
      ViewDesktopDao.batchDeleteUserDesktop({ user_id: { _in: userIdList } }),
      // 删除用户与用户组关联
      UserGroupDao.batchDelete({ user_id: { _in: userIdList } }),
      // 删除用户的权限
      AuthorizeObjectDao.batchDelete({ user_id: { _in: userIdList } })
    )
    await this.saveRedis({ userId: userIdList, type: 'delete' })
    return this.hasuraTransfer({ query: q })
  }

  static async saveRedis (data) {
    const formData = new FormData()
    formData.append('userInfo', encrypt(JSON.stringify(camelExchange(data))))
    await axios.post(`/redisData/userAlter`, formData, {
      headers: {
        'Content-type': 'application/json'
      }
    })
  }

  static async update (user, where) {
    // 写入redis
    const redisUser = _.cloneDeep(user)
    await this.saveRedis(Object.assign(redisUser, { type: 'update' }))
    const q = await generateMutation(
      UserDao.update(user, where)
    )
    await this.hasuraTransfer({ query: q })
  }

  static async updateCommon (user, where) {
    const q = await generateMutation(
      UserDao.update(user, where)
    )
    await this.hasuraTransfer({ query: q })
  }

  static async toggleFlag (user_id, flag) {
    const q = await generateMutation(
      UserDao.update({ flag }, { user_id })
    )
    await this.hasuraTransfer({ query: q })
  }

  static async clearError (user_id) {
    const q = await generateMutation(
      UserDao.update({ error_times: 0 }, { user_id })
    )
    await this.hasuraTransfer({ query: q })
  }

  static async getAllPermission () {
    // 当前用户信息
    const { groupIdList, userId } = store.getters

    const q = await generateQuery(
      AuthorizeObjectDao.find({
        where: {
          _or: [
            {
              // 工作组权限
              group_id: {
                _in: groupIdList
              }
            },
            {
              // 个人权限
              user_id: {
                _eq: userId
              }
            }
          ],
          object_type: {
            _in: [
              OBJECT_TYPE.button,
              OBJECT_TYPE.menu
            ]
          }
        },
        fields: [
          'object_id'
        ],
        alias: 'authorizeObjectList'
      })
    )

    const { data: { authorizeObjectList } } = await this.hasuraTransfer({ query: q })
    // 用户权限等于自身权限 + 所属工作组权限的并集
    const permissionList = _.uniq(authorizeObjectList.map(({ object_id }) => object_id)).filter(Boolean)

    if (_.isEmpty(permissionList)) {
      return []
    }

    // 根据权限获取按钮名称等信息
    const { data: { allPermissionList } } = await query(
      FunctionDao.find({
        where: {
          code: {
            _in: permissionList
          }
        },
        fields: [
          'code',
          'name',
          'parentCode: parent_code'
        ],
        alias: 'allPermissionList'
      })
    )

    return allPermissionList
  }

  static async login ({ userId, pwd, verifCode }) {
    return axios.post('/user/login', {
      // 新版登录接口传参
      userName: encrypt(userId),
      pwd: encrypt(pwd),
      // 旧版登录接口
      // userId: encrypt(userId),
      // encryptedPwd: encrypt(pwd),
      ...process.env.VUE_APP_SMS_ENABLED === 'true' ? {
        verifCode: encrypt(verifCode)
      } : {}
    })
  }

  static async getDetail () {
    return axios.get('/remote/getPatrolUserInfo')
  }

  static async seondLogin ({ userId, pwd }) {
    return zhenhua.post('/user/login', {
      userId: encrypt(userId),
      encryptedPwd: encrypt(pwd)
    })
  }

  static async resetPwd ({ userId, encryptedPwd, newEncryptedPwd }) {
    const data = {
      userId: encrypt(userId),
      encryptedPwd: encrypt(encryptedPwd),
      newEncryptedPwd: encrypt(newEncryptedPwd)
    }
    return axios.post('/user/changePassword', data)
  }

  static async setInitialPwd (userId) {
    const formData = new FormData()
    formData.append('userId', encrypt(userId))
    return axios.post(`/user/initPassword`, formData, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

  static async logout (token) {
  // TODO: 当前 token 并无过期时间，后端也并未提供 logout 接口
    return Timeout.set()
  }

  static async sendCaptchaByUserId (userId) {
    const formData = new FormData()
    formData.append('userId', encrypt(userId))
    return axios.post(`/approval/getVerifCode`, formData, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
  }
}

export {
  UserService
}
