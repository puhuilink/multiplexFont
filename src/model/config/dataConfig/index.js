/**
* 数据配置
* Author: dong xing
* Date: 2019/11/20
* Time: 5:12 下午
* Email: dong.xing@outlook.com
*/
import Factory from '@/model/factory/factory'

const StaticDataConfigFactory = Factory.createStaticDataConfigFactory()
const CreateDynamicDataFactory = Factory.createDynamicDataFactory()

export default class DataConfig {
  constructor ({
    sourceType = 'null',
    widgetType,
    staticDataConfig = {},
    dbDataConfig = {}
  }) {
    this.sourceType = sourceType
    this.staticDataConfig = StaticDataConfigFactory.create(widgetType, staticDataConfig)
    this.dbDataConfig = CreateDynamicDataFactory.create(widgetType, dbDataConfig)
  }
}

/**
 * 阈值变色规则
 */
export class ThresholdColorFilter {
  static filterRuleMapping = new Map([
    ['equal', ThresholdColorFilter.equal],
    ['notEqual', ThresholdColorFilter.notEqual],
    ['test', ThresholdColorFilter.test],
    ['notTest', ThresholdColorFilter.notTest],
    ['gt', ThresholdColorFilter.gt],
    ['gte', ThresholdColorFilter.gte],
    ['lt', ThresholdColorFilter.lt],
    ['lte', ThresholdColorFilter.lte]
  ])

  /**
   * 判断是否相等
   */
  static equal ({ value, thresholdValue, thresholdColor }) {
    if (value === thresholdValue) return thresholdColor
  }

  /**
   * 判断是否不等
   */
  static notEqual ({ value, thresholdValue, thresholdColor }) {
    if (value !== thresholdValue) return thresholdColor
  }

  /**
   * 判断是否匹配正则表达式
   */
  static test ({ value, thresholdValue, thresholdColor }) {
    try {
      const regexp = new RegExp(thresholdValue)
      if (regexp.test(value)) return thresholdColor
    } catch (e) {
      throw e
    }
  }

  /**
   * 判断是否不匹配正则表达式
   */
  static notTest ({ value, thresholdValue, thresholdColor }) {
    try {
      const regexp = new RegExp(thresholdValue)
      if (!regexp.test(value)) return thresholdColor
    } catch (e) {
      throw e
    }
  }

  /**
   * 判断是否大于
   */
  static gt ({ value, thresholdValue, thresholdColor }) {
    if (value > thresholdValue) return thresholdColor
  }

  /**
   * 判断是否大于等于
   */
  static ge ({ value, thresholdValue, thresholdColor }) {
    if (value >= thresholdValue) return thresholdColor
  }

  /**
   * 判断是否小于
   */
  static lt ({ value, thresholdValue, thresholdColor }) {
    if (value < thresholdValue) return thresholdColor
  }

  /**
   * 判断是否小于等于
   */
  static le ({ value, thresholdValue, thresholdColor }) {
    if (value <= thresholdValue) return thresholdColor
  }

  constructor ({ filters = [] }) {
    this.filters = filters
  }

  calculateColor (value) {
    const colors = []
    const { filters, filterRuleMapping } = this
    filters.forEach(({ rule, thresholdValue, thresholdColor }) => {
      const filter = filterRuleMapping.get(rule)
      filter && colors.push(filter({ value, thresholdValue, thresholdColor }))
    })

    return colors.filter(color => !!color)
  }
}
