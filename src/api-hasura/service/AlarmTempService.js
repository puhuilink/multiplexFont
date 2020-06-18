import { BaseService } from './BaseService'
// eslint-disable-next-line no-unused-vars
import { mutate, query } from '../utils/hasura-orm/index'
import { AlarmTempDao } from '../dao/index'
import _ from 'lodash'

class AlarmTempService extends BaseService {
  static async find (argus = {}) {
    return query(
      AlarmTempDao.find(argus)
    )
  }

  static async detail (id) {
    const { data: { tempList } } = await this.find({
      where: { id },
      fields: ['id', 'mode', 'message', 'enabled', 'title'],
      alias: 'tempList'
    })
    return _.first(tempList)
  }
}

export {
  AlarmTempService
}
