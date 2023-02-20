import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import {
  ApSourceDao
} from '../dao/ApSourceDao'
import {
  ApGroupDao
} from '../dao/ApGroupDao'
import {
  ApDictDao
} from '../dao/ApDictDao'
import { UserDao } from '@/api/dao/UserDao'
import { ALARM_STATE } from '@/tables/alarm/enum'

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
    return query(
      ApDictDao.find(argus)
    )
  }
  // 告警源列表
  static async fetchSourceList () {
    const { data: { list } } = await this.sourceFind({
      where: { enabled: true },
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
    const { data: { list } } = await this.dictFind({
      where: { condition_type: type },
      alias: 'list',
      fields: [
        'id',
        'condition_value'
      ]
    })
    return list
  }
  // 告警源列表
  static async fetchGroupList () {
    const { data: { list } } = await this.groupFind({
      alias: 'list',
      fields: [
        'id',
        'name'
      ]
    })
    return list
  }
  // 告警源列表
  static async fetchUserList () {
    const { data: { list } } = await this.userFind({
      alias: 'list',
      fields: [
        'user_id',
        'staff_name'
      ]
    })
    return list
  }
}

export {
  ApSourceService
}
