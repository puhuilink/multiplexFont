import { TimeRangeConfig } from './TimeRangeConfig'
import { ViewDataService } from '@/api/index'
import moment from 'moment'

export class AdaptorComboConfig {
  constructor ({
    dataType = '1',
    isGroup = null,
    calculateType = null,
    timeRangeConfig = {},
    top = null,
    // dataType为1时
    content = [],
    // dataType为6时
    healthyContent = [],
    // dataType为2时
    businessContent = [],
    refreshTime = 0,
    delayTime = 0
  }) {
    this.dataType = dataType
    this.isGroup = isGroup
    this.calculateType = calculateType
    this.timeRangeConfig = new TimeRangeConfig(timeRangeConfig)
    this.top = top
    this.content = content
    this.healthyContent = healthyContent
    this.businessContent = businessContent
    this.refreshTime = refreshTime
    this.delayTime = delayTime
  }

  get isAvailable () {
    if (
      (this.calculateType && !this.isGroup) ||
      (!this.calculateType && this.isGroup)
    ) {
      return false
    }

    return !!this.getCurrentContent().length
  }

  getCurrentContent () {
    switch (this.dataType) {
      case '1':
        return this.content
      case '6':
        return this.healthyContent
      // 业务系统
      case '2':
        return this.businessContent
      default:
        throw new Error(`Unknown dataType in AdaptorComboConfig: ${this.dataType}`)
    }
  }

  getOption () {
    const { dataType, isGroup, calculateType, top, timeRangeConfig } = this

    return {
      dataType,
      isGroup,
      calculateType,
      top,
      content: this.getCurrentContent(),
      timeRange: timeRangeConfig.getOption()
    }
  }

  fetch () {
    return ViewDataService
      .comboData(this.getOption())
      .then(({ data }) => data || [])
      .catch(() => [])
      .then(AdaptorComboConfig.transfer.bind(this))
  }

  transferHealthValue (obj = {}) {
    return Object
      .values(obj)
      .flat()
      .map(({
        healthValue = 100,
        systemAlias = ''
        // level1 = 0,
        // level2 = 0,
        // level3 = 0,
        // level4 = 0,
        // level5 = 0
      }) => ({
        data: healthValue,
        legend: systemAlias
      }))
  }

  // 对外数据转换接口，支持直接以原始数据生成通用数据格式
  static transfer (obj = {}) {
    // TODO: 整合不同返回结果
    if (this.dataType === '6') {
      return this.transferHealthValue(obj)
    }

    return Object
      .values(obj)
      .flat()
      .map(({
        bucket = moment().format(),
        hostAlias = '',
        endpointModelAlias = '',
        metricModelAlias = '',
        metricValue = 0,
        metricValueStr = '',
        unit = '',
        systemAlias = ''
      }) => ({
        data: ['', null, undefined].includes(metricValueStr) ? metricValue : metricValueStr,
        legend: hostAlias || systemAlias === '物资采购' ? '电子商务' : systemAlias,
        name: `${endpointModelAlias}__${metricModelAlias}`,
        time: bucket,
        unit
      }))
  }
}
