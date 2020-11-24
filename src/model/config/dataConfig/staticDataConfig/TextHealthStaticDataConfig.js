/**
 * 仪表盘静态数据
 */

const defaultTextHealthStaticData = '100'

export default class TextHealthStaticDataConfig {
  constructor ({
    staticData = defaultTextHealthStaticData
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
