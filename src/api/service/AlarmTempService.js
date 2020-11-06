import { BaseService } from './BaseService'
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

  static async add (argus = {}) {
    return mutate(
      AlarmTempDao.add(argus)
    )
  }

  static async update (set, where) {
    return mutate(
      AlarmTempDao.update(set, where)
    )
  }

  static async batchDelete (idList) {
    return mutate(
      AlarmTempDao.batchDelete({ id: { _in: idList } })
    )
  }
}

export {
  AlarmTempService
}
