/**
* 极坐标静态数据配置
* Date: 2020/5/19
* Time: 11:51 上午
*/

const defaultPolarStaticData = {
  angleAxis: {
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  legend: {
    data: ['A', 'B', 'C']
  },
  series: [
    {
      data: [1, 2, 3, 4, 3, 5, 1],
      name: 'A'
    }, {
      data: [2, 4, 6, 1, 3, 2, 1],
      name: 'B'
    }, {
      data: [1, 2, 3, 4, 1, 2, 5],
      name: 'C'
    }
  ]
}

export default class PolarStaticDataConfig {
  constructor ({
    staticData = defaultPolarStaticData
  }) {
    this.staticData = staticData
  }

  /**
   * 获取极坐标静态数据代码
   * @returns {string}
   */
  getCode () {
    return JSON.stringify(this.staticData, null, '\t')
  }

  /**
   * 更新极坐标静态数据
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
