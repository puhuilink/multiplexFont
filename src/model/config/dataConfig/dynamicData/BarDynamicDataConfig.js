/**
 * 柱形图动态数据配置
 */

import _ from 'lodash'
import { DynamicDataConfig } from './common/index'
import {
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_ALARM
} from './types/sourceType'

const initialOption = {
  legend: {},
  xAxis: {},
  yAxis: {},
  series: [],
  originalData: null
}

export default class BarDynamicDataConfig extends DynamicDataConfig {
  async getOption (loadingDynamicData, sourceType) {
    if (loadingDynamicData) {
      switch (sourceType) {
        case SOURCE_TYPE_REAL: {
          await this.getRealDataOption()
          break
        }
        case SOURCE_TYPE_ALARM: {
          await this.getAlarmOption()
          break
        }
      }
    }
    const { legend, xAxis, yAxis, series } = this
    return { legend, xAxis, yAxis, series }
  }

  async getRealDataOption () {
    const dataList = await this.resourceConfig.fetch()
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
    Object.assign(this, option)
  }

  async getAlarmOption () {
    const dataList = await this.alarmConfig.fetch()
    const option = {
      legend: {
        data: [ '严重告警', '重大告警', '次要告警', '一般告警', '最新通知' ]
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
    Object.assign(this, option)
  }

  resetData () {
    Object.assign(this, _.cloneDeep(initialOption))
  }
}
