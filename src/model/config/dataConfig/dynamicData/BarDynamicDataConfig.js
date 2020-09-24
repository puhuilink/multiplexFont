import _ from 'lodash'
import { DynamicDataConfig } from './common/index'

const initialOption = {
  legend: {},
  xAxis: {},
  yAxis: {},
  series: [],
  originalData: null
}

export default class BarDynamicDataConfig extends DynamicDataConfig {
  async fetch () {
    const dataList = await super.fetch()
    const groupByLegend = _.groupBy(dataList, 'legend')
    const categoryList = Object.keys(groupByLegend)
    const groupByName = _.groupBy(dataList, 'name')
    const legendList = Object.keys(groupByName)
    const option = {
      legend: {
        data: legendList
      },
      xAxis: {
        type: 'category',
        data: categoryList
      },
      yAxis: {
        type: 'value'
      },
      series: legendList.map(name => ({
        name: name,
        data: groupByName[name].map(({ data }) => data)
      }))

    }
    return option
  }

  async getAlarmOption () {
    const dataList = await this.alarmConfig.fetch()
    const option = {
      legend: {
        // data: legendList
        data: [
          '严重告警',
          '重大告警',
          '次要告警',
          '一般告警',
          '最新通知'
        ]
      },
      xAxis: {
        type: 'category',
        data: dataList.map(({ time }) => time)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '严重告警',
          data: dataList.map(({ level5 }) => level5)
        },
        {
          name: '重大告警',
          data: dataList.map(({ level4 }) => level4)
        },
        {
          name: '次要告警',
          data: dataList.map(({ level3 }) => level3)
        },
        {
          name: '一般告警',
          data: dataList.map(({ level2 }) => level2)
        },
        {
          name: '最新通知',
          data: dataList.map(({ level1 }) => level1)
        }
      ]

    }
    return option
  }

  async getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      const data = await this.fetch()
      Object.assign(this, data)
    }
    const { legend, xAxis, yAxis, series } = this
    return { legend, xAxis, yAxis, series }
  }

  resetData () {
    Object.assign(this, _.cloneDeep(initialOption))
  }
}
