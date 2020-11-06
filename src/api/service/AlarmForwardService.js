import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { AlarmSenderDao, SendRecordDao } from '../dao'
import _ from 'lodash'

class AlarmForwardService extends BaseService {
  static async find (argus = {}) {
    return query(
      AlarmSenderDao.find(argus)
    )
  }

  static async findHistory (argus = {}) {
    return query(
      SendRecordDao.find(argus)
    )
  }

  static async detail (id) {
    const { data: { sendRecordList } } = await this.find({
      where: { id },
      fields: ['id', 'status'],
      alias: 'sendRecordList'
    })
    return _.first(sendRecordList)
  }
}

export {
  AlarmForwardService
}
