import { BaseService } from './BaseService'
import { mutate, query } from '../utils/hasura-orm/index'
import { StrategyDao, SendRecordDao } from '../dao'
import _ from 'lodash'
import { axios } from '@/utils/request'

class StrategyService extends BaseService {
  static async find (argus = {}) {
    return query(
      StrategyDao.find(argus)
    )
  }

  static async detail (id) {
    const { data: { strategyList } } = await query(
      StrategyDao.find({
        where: { id },
        fields: [
          'deviceType: device_type',
          'deviceBrand: device_brand',
          'deviceModel: device_model',
          'hostId: host_id',
          'endpointModelId: endpoint_model_id',
          'metricModelId: metric_model_id',
          'name',
          'exprs',
          'enabled'
        ],
        alias: 'strategyList'
      })
    )
    return _.first(strategyList)
  }

  static async add (argus = {}) {
    await axios.post('/strategy/add', _.pick(argus, [
      'deviceType',
      'deviceBrand',
      'deviceModel',
      'hostId',
      'endpointModelId',
      'metricModelId',
      'name',
      'exprs',
      'enabled'
    ]))
  }

  static async update (argus = {}) {
    await axios.post('/strategy/add', _.pick(argus, [
      'id',
      'name',
      'exprs',
      'enabled'
    ]))
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
