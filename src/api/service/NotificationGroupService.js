import { axios } from '@/utils/request'

class NotificationGroupService {
  static async getGroup () {
    // 获取通知组信息
    await axios.get('/configuration/group/list')
  }

  static async getUser (param = {}) {
    // 获取通知组信息
    await axios.post('/configuration/group/listUser', param)
  }
}

export { NotificationGroupService }
