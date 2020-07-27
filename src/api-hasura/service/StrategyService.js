import { BaseService } from './BaseService'
import { mutate, query } from '../utils/hasura-orm/index'
import { StrategyDao, SendRecordDao } from '../dao'
// import _ from 'lodash'

class StrategyService extends BaseService {
  static async find (argus = {}) {
    return query(
      StrategyDao.find(argus)
    )
  }

  static async add (argus = {}) {
    return mutate(
      SendRecordDao.add(argus)
    )
  }

  static async update (set = {}, where = {}) {
    return mutate(
      SendRecordDao.update(set, where)
    )
  }

  static async batchDelete (idList = []) {
    return mutate(
      SendRecordDao.batchDelete({ id: { _in: idList } })
    )
  }
}

export {
  StrategyService
}
