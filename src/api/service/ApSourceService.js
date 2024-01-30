import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import {
  ApSourceDao
} from '../dao/ApSourceDao'
import {
  ApGroupDao
} from '../dao/ApGroupDao'
import { UserDao } from '@/api/dao/UserDao'
import { alarm } from '@/utils/request'
import { decrypt } from '@/utils/aes'

class ApSourceService extends BaseService {
  static async sourceFind (argus = {}) {
    return query(
      ApSourceDao.find(argus)
    )
  }
  static async groupFind (argus = {}) {
    return query(
      ApGroupDao.find(argus)
    )
  }
  static async userFind (argus = {}) {
    return query(
      UserDao.find(argus)
    )
  }
  static async dictFind (argus = {}) {
    return alarm.post('/api/alert/policy/findDict', argus)
  }
  // 告警源列表
  static async fetchSourceList () {
    const { data } = await alarm.get('/api/integration/source/get')
    const list = []
    data.forEach(d => {
      list.push({
        id: d.sourceId,
        name: d.sourceName
      })
    })
    return list
  }
  static async fetchAllSourceList () {
    const { data: { list } } = await this.sourceFind({
      alias: 'list',
      fields: [
        'id',
        'name'
      ]
    })
    return list
  }
  // 告警源列表
  static async fetchDictList (type) {
    const { data } = await this.dictFind({ condition_type: type })
    return data
  }
  // 告警源列表
  static async fetchGroupList () {
    const { data } = await alarm.post('/api/configuration/notify/listUser', { 'notifyStaffType': '0' })
    data.forEach(d => {
      d.id = decrypt(d.id)
    })
    return data
  }
  // 告警源列表
  static async fetchUserList () {
    const { data } = await alarm.post('/api/configuration/notify/listUser', { 'notifyStaffType': '1' })
    const list = []
    data.forEach(d => {
      list.push({
        user_id: decrypt(d.id),
        staff_name: d.name
      })
    })
    console.log(list)
    return list
  }
}

export {
  ApSourceService
}
