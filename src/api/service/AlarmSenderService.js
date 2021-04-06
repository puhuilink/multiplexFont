import { BaseService } from '@/api/service/BaseService'
import { AlarmSenderDao } from '../dao/index'
import { mutate, query } from '@/api/utils/hasura-orm'

class AlarmSenderService extends BaseService {
  static async find (argus = {}) {
    return query(
      AlarmSenderDao.find(argus)
    )
  }

  static async findByid (id) {
    const { data: { senderList } } = await this.find({
      where: { id: { _eq: id } },
      fields: [
        'event_level',
        'send_type',
        'group_id',
        'contact',
        'auto',
        'temp_email_id',
        'temp_sms_id'
      ],
      alias: 'senderList'
    })
    return senderList[0]
  }

  static async batchDelete (alarmIds = []) {
    await mutate(AlarmSenderDao.batchDelete({ id: { _in: alarmIds } }))
  }

  static async update (set, where) {
    return mutate(AlarmSenderDao.update(set, where))
  }
}

export { AlarmSenderService }
