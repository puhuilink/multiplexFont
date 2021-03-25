import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { AlarmRuleDao } from '../dao/index'
import { AlarmForwardService } from './AlarmForwardService'
import _ from 'lodash'
import { axios } from '@/utils/request'

class AlarmRuleService extends BaseService {
  static async find (argus = {}) {
    return query(
      AlarmRuleDao.find(argus)
    )
  }

  static async add (argus = {}) {
    const data = _.omit(argus, ['id'])
    if (_.isElement(data['hostId'])) {
      data['hostId'] = null
    }
    return axios.post('/AlarmAndRule/add', data)
  }

  static async update (argus = {}) {
    return axios.post('/AlarmAndRule/update', _.pick(argus, [
      'id',
      'merge',
      'upgrade',
      'recover',
      'forward',
      'title',
      'enabled'
    ]))
  }

  static async detail (id) {
    // 告警规则信息
    const { data: { alarmRuleList } } = await this.find({
      where: { id },
      fields: [
        'id',
        'title',
        'deviceType: device_type',
        'deviceBrand: device_brand',
        'deviceModel: device_model',
        'dictType { value_label }',
        'dictBrand { value_label }',
        'modelMetric { alias }',
        'modelEndpoint { alias }',
        'ruleType: rule_type',
        'hostId: host_id',
        'endpointModelId: endpoint_model_id',
        'metricModelId: metric_model_id',
        'content',
        'enabled'
      ],
      alias: 'alarmRuleList'
    })
    const detail = _.first(alarmRuleList)

    // 告警规则类型为前转时，查询其关联的前转配置
    if (_.get(detail, 'rule_type') === 'forward') {
      detail.sendList = await this.sendList(detail)
    }
    return detail
  }

  static async global (rule_type) {
    const { data: { alarmRuleList } } = await query(
      AlarmRuleDao.find({
        where: {
          rule_type,
          mode: 'global'
        },
        fields: [
          'id',
          'enabled',
          'title',
          'content',
          'mode',
          'ruleType: rule_type'
        ],
        alias: 'alarmRuleList'
      })
    )

    return _.first(alarmRuleList)
  }

  /**
   * 前转规则的通知内容
   */
  static async sendList ({ host_id, endpoint_id, metric_id }) {
    const { data: { sendList } } = await AlarmForwardService.find({
      where: { host_id, endpoint_id, metric_id },
      fields: ['event_level', 'send_type', 'contact', 'temp_id'],
      alias: 'sendList'
    })

    return sendList
  }

  static async batchDelete (ruleIds = []) {
    const formData = new FormData()
    formData.append('ruleIds', ruleIds)
    return axios.post(`/AlarmAndRule/delete`, formData, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

  static async batchToggleEnabled (ruleIds = [], enabled = true) {
    const formData = new FormData()
    formData.append('ruleIds', ruleIds)
    formData.append('enabled', enabled)
    return axios.post('/AlarmAndRule/batchEnabled', formData, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

  static async devices (ruleId) {
    return axios.get('/AlarmAndRule/ruleDevices', {
      params: {
        ruleId,
        type: 'alarm'
      }
    })
  }

  // 告警下钻第一个展示的页面 请求接口
  static async AlarmPopupDetail (id = {}) {
    return axios.post('/host/hostDetail', {
      id
    })
  }

  // 告警下钻,点击单个内容详情
  static async AlarmRecordDetails (id) {
    return axios.post('/endpoint/endpointDetail', {
      id
    })
  }

  // 告警下钻，展示历史记录详情
  static async historyAlarmDataView (startTime, entTime, content) {
    return axios.post('/data/view', { dataType: 1, startTime: entTime[0], entTime: startTime[0], content: [{ hostId: content.AlarmhostId, endpointId: content.endpointId, endpointModelId: content.endpointModelId, metricId: content.metricId, metricModelId: content.metricModelId }]
    })
  }
}

export {
  AlarmRuleService
}
