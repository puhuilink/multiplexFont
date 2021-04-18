import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { AlarmRuleDao, CmdbEndpointDao } from '../dao/index'
import _ from 'lodash'
import { axios } from '@/utils/request'
import { dataToArray } from 'ant-design-vue/lib/vc-drawer/src/utils'

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
    // if (_.get(detail, 'rule_type') === 'forward') {
    //   detail.sendList = await this.sendList(detail)
    // }
    return detail
  }

  static async addUser (param) {
    const newParam = {
      level: param.level,
      groupId: param.group,
      contact: _.join(param.contact, '/'),
      smsId: Number(param.temp_sms_id),
      emailId: Number(param.temp_email_id),
      auto: param.auto
    }
    return axios.post('notice/addNoticeMember', newParam)
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
  // static async sendList ({ host_id, endpoint_id, metric_id }) {
  //   const { data: { sendList } } = await AlarmForwardService.find({
  //     where: { host_id, endpoint_id, metric_id },
  //     fields: ['event_level', 'send_type', 'contact', 'temp_id'],
  //     alias: 'sendList'
  //   })
  //
  //   return sendList
  // }

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

  /**
   * index为offset和limit的集合 {limit: 25, offset: 0}
   * @param id
   * @param index
   */
  static async hostPerformanceDetail (id, index, alarmList) {
    const { offset, limit, ...rest } = index
    const data = { hostId: id, offset, limit, level: alarmList }
    if (index.hasOwnProperty('orderBy')) {
      Reflect.set(data, 'order', rest.alarmLevel)
    }
    if (alarmList.length === 0) {
      Reflect.deleteProperty(data, 'level')
    }
    return axios
      .post('/host/hostDetail', { ...data })
      .then(({ data }) => data)
  }

  static async endpointPerformanceDetail (id, index, alarmList) {
    const { offset, limit, ...rest } = index
    const data = { endpointId: id, offset, limit, level: alarmList }
    if (index.hasOwnProperty('orderBy')) {
      Reflect.set(data, 'order', rest.alarmLevel)
    }
    if (alarmList.length === 0) {
      Reflect.deleteProperty(data, 'level')
    }
    return axios
      .post('/endpoint/endpointDetail', { ...data })
      .then(({ data }) => data)
  }

  // 告警下钻，展示历史记录详情
  static async historyAlarmDataView (startTime, entTime, content) {
    return axios.post('/data/view', { dataType: 1, startTime: entTime[0], endTime: startTime[0], content: [{ hostId: content.AlarmhostId, endpointId: content.endpointId, endpointModelId: content.endpointModelId, metricId: content.metricId, metricModelId: content.metricModelId }]
    })
  }
}

export {
  AlarmRuleService
}
