import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { CmdbStrategyDao, ModelStrategyDao } from '../dao/index'
import _ from 'lodash'
import { axios } from '@/utils/request'

class StrategyService extends BaseService {
  static async find (argus = {}) {
    return query(
      CmdbStrategyDao.find(argus)
    )
  }

  static async modelFind (argus = {}) {
    return query(
      ModelStrategyDao.find(argus)
    )
  }

  static async detail (id) {
    const { data: { strategyList } } = await query(
      CmdbStrategyDao.find({
        where: { id },
        fields: [
          'id',
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

  static async modelFetch (id) {
    const { data: { strategyList } } = await query(
      ModelStrategyDao.find({
        where: { id },
        fields: [
          'id',
          'deviceType: model { device_type }',
          'deviceBrand: model { brand_name }',
          'deviceModel: model { endpoint_alias }',
          'hostId: model { host_id }',
          'endpointModelId: model { endpoint_id }',
          'metricModelId: metric_id',
          'exprs'
        ],
        alias: 'strategyList'
      })
    )
    const list = _.first(strategyList)
    list.deviceType = list.deviceType.device_type
    list.deviceBrand = list.deviceBrand.brand_name
    list.deviceModel = list.deviceModel.endpoint_alias
    list.endpointModelId = list.endpointModelId.endpoint_id
    return list
  }

  static async add (argus = {}) {
    const data = _.pick(argus, [
      'deviceType',
      'deviceBrand',
      'deviceModel',
      'hostId',
      'endpointModelId',
      'metricModelId',
      'name',
      'exprs',
      'enabled'
    ])
    if (_.isEmpty(data['hostId'])) {
      data['hostId'] = null
    }
    const post = await axios.post('/strategy/add', data)
    return post
  }

  static async update (argus = {}) {
    await axios.post('/strategy/update', _.pick(argus, [
      'id',
      'name',
      'exprs',
      'enabled'
    ]))
  }

  static async batchDelete (ruleIds = []) {
    const formData = new FormData()
    formData.append('ruleIds', ruleIds)
    return axios.post(`/strategy/delete`, formData, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

  static async batchToggleEnabled (ruleIds = [], enabled = true) {
    const formData = new FormData()
    formData.append('ruleIds', ruleIds)
    formData.append('enabled', enabled)
    return axios.post('/strategy/batchEnabled', formData, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

  static async devices (ruleId) {
    return axios.get('/AlarmAndRule/devices', {
      ruleId,
      type: 'strategy'
    })
  }
}

export {
  StrategyService
}
