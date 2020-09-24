/**
 * 视图组件数据
 * 对接后端接口
 */
import { BaseService } from './BaseService'
import { imp } from '@/utils/request'
import _ from 'lodash'

export class ViewDataService extends BaseService {
  /**
   * 视图组件指标查询
   */
  static async chartValue ({ timeRange = {}, ...argus }) {
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
    }

    // FIXME: 校验不准确
    // const fieldsMapping = new Map([
    //   ['deviceType', '监控类型'],
    //   ['deviceBrand', '品牌名称'],
    //   ['deviceModel', '品牌设备'],
    //   ['deviceModel', '设备名称'],
    //   ['endpointModelId', '监控实体'],
    //   ['endpointModelId', '监控实体'],
    //   ['metricModelIds', '检查项']
    // ])

    // let passValidate = true

    // for (const field of [...fieldsMapping.keys()]) {
    //   const value = data[field]
    //   if (!value || _.isEmpty(value)) {
    //     // message.error(`请选择${fieldsMapping.get(field)}`)
    //     passValidate = false
    //     break
    //   }
    // }

    // if (!passValidate) {
    //   return []
    // }

    // console.log(data)
    return imp.post('/view/data', data)
  }
}
