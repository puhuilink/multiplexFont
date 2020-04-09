/**
 * 仪表盘静态数据
 */

import _ from 'lodash'

const defaultGaugeStaticData = {
  value: 0
}

export default class GaugeStaticDataConfig {
  constructor ({
    staticData = defaultGaugeStaticData
  }) {
    this.staticData = staticData
  }
  /**
   * 获取柱形图静态数据代码
   * @returns {string}
   */
  getCode (barType) {
    const staticData = _.cloneDeep(this.staticData)
    return JSON.stringify(staticData, null, '\t')
  }

  /**
   * 更新静态数据
   * @param config
   * @param code
   */
  updateStaticData (config, code) {
    Object.assign(
      config.dataConfig.staticDataConfig,
      { staticData: JSON.parse(code) }
    )
  }
}
