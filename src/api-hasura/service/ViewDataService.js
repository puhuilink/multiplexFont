/**
 * 视图组件数据
 * 对接后端接口
 */
import { BaseService } from './BaseService'
import { imp } from '@/utils/request'
import _ from 'lodash'

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
      'calculateType'
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

    if (this._validate(data)) {
      return imp.post('/view/data', data, config).catch(() => ({ data: [] }))
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
      'type'
    ])

    // 时间范围
    if (!_.isEmpty(timeRange)) {
      Object.assign(data, _.pick(timeRange, ['startTime', 'endTime']))
    } else {
      // 不选时间段时只能为 type
      Reflect.deleteProperty(data, 'isGroup')
    }

    for (const key in data) {
      const value = data[key]
      if (Array.isArray(value) && value.length === 0) {
        Reflect.deleteProperty(data, key)
      }
    }

    if (this._validate(data)) {
      return imp.post('/view/alarm', data, config).catch(() => ({ data: [] }))
    } else {
      return []
    }
  }

  /**
   * (性能)汇总数据查询
   */
  static async overviewData ({ timeRange = {}, ...argus }, config = {}) {
    const data = _.pick(argus, [
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
      return imp.post('/view/map', data, config).catch(() => ({ data: [] }))
    } else {
      return []
    }
  }
}
