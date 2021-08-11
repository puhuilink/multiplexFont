/**
 * 视图组件数据
 * 对接后端接口
 */
import { BaseService } from './BaseService'
import { axios, sql } from '@/utils/request'
import { XmPaessMetricDao } from '../dao/index'
import _ from 'lodash'
import { query } from '../utils/hasura-orm/index'

export class ViewDataService extends BaseService {
  static _validate (argus = {}) {
    let isPass = true
    for (const value of Object.values(argus)) {
      if (
        value === undefined ||
        value === null ||
        (Array.isArray(value) && _.isEmpty(value))
      ) {
        isPass = false
        break
      }
    }
    return isPass
  }

  /**
   * 性能数据查询
   */
  static async realData ({ timeRange = {}, ...argus }, config = {}) {
    // 监控设备
    const data = _.pick(argus, [
      'deviceType',
      'deviceBrand',
      'deviceModel',
      'hostId',
      'endpointModelId',
      'metricModelIds',
      'calculateType',
      'metricIds'
    ])

    data['metricModelIds'] = _.castArray(data['metricModelIds'])
    data['hostId'] = _.castArray(data['hostId'])

    // 分组条件的前提是有计算类型
    if (data['calculateType']) {
      Object.assign(data, _.pick(argus, ['isGroup']))
    }

    // 时间范围
    if (!_.isEmpty(timeRange)) {
      Object.assign(data, _.pick(timeRange, ['startTime', 'endTime']))
    } else {
      Reflect.deleteProperty(data, 'isGroup')
      Reflect.deleteProperty(data, 'calculateType')
    }

    if (!data['calculateType']) {
      Reflect.deleteProperty(data, 'isGroup')
      Reflect.deleteProperty(data, 'calculateType')
    }

    if (!data['metricIds'] || _.isEmpty(data['metricIds'])) {
      Reflect.deleteProperty(data, 'metricIds')
    }

    if (this._validate(data)) {
      return axios.post('/view/data', data, config).catch(() => ({ data: [] }))
    } else {
      return []
    }
  }

  /**
   * 告警数据查询
   */
  static async alarmData ({ timeRange = {}, ...argus }, config = {}) {
    const data = _.pick(argus, [
      'deviceType',
      'level',
      'origin',
      'isGroup',
      'calculateType',
      'type',
      'hostId'
    ])

    // 时间范围
    if (!_.isEmpty(timeRange)) {
      Object.assign(data, _.pick(timeRange, ['startTime', 'endTime']))
    } else {
      // 不选时间段时只能为 type
      Reflect.deleteProperty(data, 'isGroup')
    }

    // 设备ID可选
    if (!data['hostId']) {
      Reflect.deleteProperty(data, 'hostId')
    }

    for (const key in data) {
      const value = data[key]
      if (Array.isArray(value) && value.length === 0) {
        Reflect.deleteProperty(data, key)
      }
    }

    if (this._validate(data)) {
      return axios.post('/view/alarm', data, config).catch(() => ({ data: [] }))
    } else {
      console.warn(`/view/alarm未生效的接口传参`, data)
      return []
    }
  }

  /**
   * (性能)汇总数据查询
   */
  static async overviewData ({ timeRange = {}, ...argus }, config = {}) {
    const data = _.pick(argus, [
      'hostAlias',
      'endpointAlias',
      'alias',
      'origin',
      'isGroup',
      'calculateType'
    ])

    // 时间范围
    if (!_.isEmpty(timeRange)) {
      Object.assign(data, _.pick(timeRange, ['startTime', 'endTime']))
    } else {
      Reflect.deleteProperty(data, 'calculateType')
      Reflect.deleteProperty(data, 'isGroup')
    }

    if (this._validate(data)) {
      return axios.post('/view/map', data, config).catch(() => ({ data: [] }))
    } else {
      return []
    }
  }

  static async comboData ({ timeRange = {}, top = 0, ...argus }) {
    const data = { ...argus }
    // 时间范围
    if (!_.isEmpty(timeRange)) {
      Object.assign(data, _.pick(timeRange, ['startTime', 'endTime']))
    } else {
      Reflect.deleteProperty(data, 'calculateType')
      Reflect.deleteProperty(data, 'isGroup')
    }

    if (top) {
      Object.assign(data, { top })
    }

    return axios.post('/data/view', data)
  }

  /**
   * 厦门动环指标
   */
  static async xmDHMetric ({ code = '' }) {
    const { data: { list } } = await query(
      XmPaessMetricDao.find({
        where: {
          code: { _eq: code }
        },
        fields: ['value: metric_value'],
        limit: 1,
        orderBy: {
          upload_time: 'desc_nulls_last'
        },
        alias: 'list'
      })
    )

    return _.get(list, ['0', 'value'], '')
  }
  /*
  * hostType数量
  * */
  static async NumTop (location = []) {
    const query = `select host_type as name, count(*) as data from t_cmdb_host where 1 = 1 ${location.length > 0 ? 'and location in (' + location.join() + ')' : ''}group by host_type,location order by count(*) desc limit 10;`
    const data = await sql(query)
    console.log(data)
    return data.slice(1, data.length)
  }
}
