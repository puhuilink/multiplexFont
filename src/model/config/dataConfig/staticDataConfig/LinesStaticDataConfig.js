/**
 * 折线图静态数据
 * Author: dong xing
 * Date: 2019/11/22
 * Time: 4:48 下午
 * Email: dong.xing@outlook.com
 */
import _ from 'lodash'

const defaultLinesStaticData = {
  legend: {
    data: ['折线图示例']
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'line',
      name: '折线图示例',
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
}

export default class LinesStaticDataConfig {
  constructor ({
    staticData = defaultLinesStaticData
  }) {
    this.staticData = _.cloneDeep(staticData)
  }

  /**
   * 获取折线图静态数据代码
   * @returns {string}
   */
  getCode () {
    const { staticData: { series, ...code } } = this
    return JSON.stringify({
      ...code,
      series: series.map(el => _.pick(el, ['name', 'data']))
    }, null, '\t')
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
