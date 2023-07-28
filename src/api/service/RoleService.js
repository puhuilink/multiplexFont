import { BaseService } from './BaseService'
import { mutate, query } from '../utils/hasura-orm/index'
import _ from 'lodash'
import { axios, xungeng } from '@/utils/request'
import { decrypt } from '@/utils/aes'

class RoleService extends BaseService {
  // 角色列表
  static async find (roleName, roleType, createTime) {
    try {
      const { code, data } =
        await xungeng.post('/role/list',
          { 'roleName': roleName, 'roleType': roleType, 'createTime': createTime })
      if (code === 200) {
        data.map(el => {
          if (el.contact) {
            el.contact = decrypt(el.contact)
          }
          return el
        })
        return data
      }
    } catch (e) {
      this.$notifyError(e)
    }
  }
  // 分配用户给角色
  static async assignment (roleCode, userIds = []) {
    try {
      const { code, data } =
        await xungeng.post('/role/addUsers',
          { 'roleCode': roleCode, 'userIds': userIds })
      if (code === 200) {
        data.map(el => {
          if (el.contact) {
            el.contact = decrypt(el.contact)
          }
          return el
        })
        return data
      }
    } catch (e) {
      this.$notifyError(e)
    }
  }// 分配用户给角色
  static async update (roleCode, userIds = []) {
    try {
      const { code, data } =
        await xungeng.post('/role/addUsers',
          { 'roleCode': roleCode, 'userIds': userIds })
      if (code === 200) {
        data.map(el => {
          if (el.contact) {
            el.contact = decrypt(el.contact)
          }
          return el
        })
        return data
      }
    } catch (e) {
      this.$notifyError(e)
    }
  }
}

export {
  RoleService
}
