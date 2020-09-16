import _ from 'lodash'
import moment from 'moment'

export const ruleColumnSnippetStart = (alarm) => [
  {
    title: alarm ? '规则名称' : '阈值名称',
    dataIndex: alarm ? 'title' : 'name',
    fixed: 'left',
    width: 300,
    sorter: true
  }
]

export const ruleColumnSnippetMiddle = () => [
  {
    title: '监控类型',
    dataIndex: 'device_type dictType { value_label }',
    width: 200,
    customRender: (__, { device_type, dictType }) => _.get(dictType, 'value_label') || device_type
  },
  {
    title: '品牌名称',
    dataIndex: 'device_brand dictBrand { value_label }',
    width: 200,
    customRender: (__, { device_brand, dictBrand }) => _.get(dictBrand, 'value_label') || device_brand
  },
  {
    title: '品牌设备',
    dataIndex: 'device_model dictModel { value_label }',
    width: 200,
    customRender: (__, { device_model, dictModel }) => _.get(dictModel, 'value_label') || device_model
  },
  {
    title: '监控实体',
    dataIndex: 'metric_model_id modelMetric { alias }',
    width: 200,
    customRender: (metricModelId, { modelMetric }) => _.get(modelMetric, 'alias') || metricModelId
  },
  {
    title: '检查项',
    dataIndex: 'endpoint_model_id modelEndpoint { alias }',
    width: 200,
    customRender: (endpointModelId, { modelEndpoint }) => _.get(modelEndpoint, 'alias') || endpointModelId
  }
]

export const ruleColumnSnippetEnd = (alarm = false) => [
  {
    title: '更新时间',
    dataIndex: alarm ? 'update_time' : 'last_update_time',
    width: 200,
    sorter: true,
    customRender: time => time ? moment(time).format() : ''
  },
  {
    title: '启用状态',
    dataIndex: 'enabled',
    width: 200,
    fixed: 'right',
    sorter: true,
    scopedSlots: {
      customRender: 'enabled'
    }
  }

]
