
import _ from 'lodash'

const defaultListStaticData = {
  columns: [],
  ListData: []
}

export default class DegreeRingStaticDataConfig {
  constructor ({
    staticData = defaultListStaticData
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
}
