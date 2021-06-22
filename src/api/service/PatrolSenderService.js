import { BaseService } from '@/api/service/BaseService'
import { PatrolSenderDao } from '../dao/PatrolSenderDao'
import { query } from '../utils/hasura-orm/index'
import { xungeng } from '@/utils/request'
import _ from 'lodash'
import { encrypt } from '@/utils/aes'

class PatrolSenderService extends BaseService {
  static async find (args = {}) {
    const q = await query(
      PatrolSenderDao.find(args)
    )
    return q
  }

  static async insert (sender) {
    sender.contact = encrypt(_.join(sender.contact, '/'))
    const q = await xungeng.post('/sender/add', sender)
    return q
  }

  static async batchDelete (ids) {
    const format = { ids: ids }
    const q = await xungeng.post('/sender/delete', format)
    return q
  }

  static async update (sender) {
    if (sender.contact.length > 0) {
      sender.contact = encrypt(_.join(sender.contact, '/'))
    }
    const q = await xungeng.post('/sender/update', sender)
    return q
  }
}

export { PatrolSenderService }
