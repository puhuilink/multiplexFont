/**
 * 仪表盘静态数据
 */

const defaultDegreeRingStaticData = '100'

export default class DegreeRingStaticDataConfig {
  constructor ({
    staticData = defaultDegreeRingStaticData
  }) {
    this.staticData = staticData
  }
  /**
   * 获取柱形图静态数据代码
   * @returns {string}
   */
  getCode (barType) {
    return JSON.stringify(this.staticData, null, '\t')
  }
}
