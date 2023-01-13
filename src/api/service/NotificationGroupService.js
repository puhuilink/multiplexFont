import { alarm } from '@/utils/request'

class NotificationGroupService {
  static async getGroup () {
    // 获取通知组信息
    await alarm.get('/api/configuration/group/list')
  }

  static async getUser (param = {}) {
    // 获取通知组信息
    await alarm.post('/api/configuration/group/listUser', param)
  }

  static async getUnassignedUser () {
    const { data } = await alarm.get('/api/configuration/group/getUser')
    return data.map(el => ({ value: el.accountId, label: el.accountName }))
  }
}

export { NotificationGroupService }
