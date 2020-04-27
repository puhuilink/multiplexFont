/**
 * 柱形图静态数据
 * Author: dong xing
 * Date: 2019/11/26
 * Time: 2:24 下午
 * Email: dong.xing@outlook.com
 */

import _ from 'lodash'
const defaultBarStaticData = {
  legend: {},
  xAxis: {
    type: 'category',
    data: ['Forest', 'Steppe', 'Desert', 'Wetland']
  },
  yAxis: {
    type: 'value'
  },
  singleSeries: [
    {
      name: 'Forest',
      type: 'bar',
      stack: 'stack',
      data: [320, 0, 0, 0]
    },
    {
      name: 'Steppe',
      type: 'bar',
      stack: 'stack',
      data: [0, 182, 0, 0]
    },
    {
      name: 'Desert',
      type: 'bar',
      stack: 'stack',
      data: [0, 0, 201, 0]
    },
    {
      name: 'Wetland',
      type: 'bar',
      stack: 'stack',
      data: [0, 0, 0, 400]
    }
  ],
  multipleSeries: [
    {
      name: 'Forest',
      type: 'bar',
      stack: null,
      data: [320, 332, 301, 334, 390]
    },
    {
      name: 'Steppe',
      type: 'bar',
      stack: null,
      data: [220, 182, 191, 234, 290]
    },
    {
      name: 'Desert',
      type: 'bar',
      stack: null,
      data: [150, 232, 201, 154, 190]
    },
    {
      name: 'Wetland',
      type: 'bar',
      stack: null,
      data: [98, 77, 101, 99, 40]
    }
  ]
}

export default class BarStaticDataConfig {
  constructor ({
    staticData = defaultBarStaticData
  }) {
    this.staticData = staticData
  }

  /**
   * 获取柱形图静态数据代码
   * @returns {string}
   */
  getCode (barType) {
    const { staticData } = this
    const { singleSeries, multipleSeries } = staticData
    // 单列多列、是否堆叠、样式等配置从属性配置页面设置
    const originalSource = _.omit(_.cloneDeep(staticData), ['singleSeries', 'multipleSeries'])
    const series = _.cloneDeep(barType === 'single' ? singleSeries : multipleSeries).map(el => _.omit(el, ['stack', 'itemStyle', 'barWidth']))
    Object.assign(originalSource, { series })
    return JSON.stringify(originalSource, null, '\t')
  }

  /**
   * 更新静态数据
   * @param config
   * @param code
   */
  updateStaticData (config, code) {
    const { barType } = config.proprietaryConfig
    const typeMapping = new Map([
      ['single', 'singleSeries'],
      ['multiple', 'multipleSeries']
    ])
    Object.assign(
      config.dataConfig.staticDataConfig.staticData,
      Object.assign(_.omit(JSON.parse(code), ['series'])),
      {
        [typeMapping.get(barType)]: JSON.parse(code).series
      }
    )
  }
}
