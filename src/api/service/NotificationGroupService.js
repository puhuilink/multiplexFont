import { alarm } from '@/utils/request'
import _ from 'lodash'

class NotificationGroupService {
  static async getGroup () {
    // 获取通知组信息
    const data = await alarm.get('/api/configuration/group/list')
    return data.data
  }

  static async findUser (id) {
    const { data } = await alarm.post('/api/configuration/group/listUser', { groupID: _.get(id, '0.groupId') })
    return data.map(el => _.pick(el, ['accountId', 'accountName', 'leader']))
  }

  static async getUser (param = {}) {
    // 获取通知组信息
    await alarm.post('/api/configuration/group/listUser', param)
  }

  static async getUnassignedUser () {
    const { data } = await alarm.get('/api/configuration/group/getUser')
    return data.map(el => ({ value: el.accountId, label: el.accountName }))
  }

  static async deleteGroup (id) {
    return alarm.post('/api/configuration/group/delete', { groupId: id })
  }
}

export { NotificationGroupService }
