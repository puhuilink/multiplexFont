/**
* 极坐标动态数据配置
*/

import _ from 'lodash'
import { DynamicDataConfig } from './common/index'
import {
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_ALARM
} from './types/sourceType'

const initialOption = {
  legend: {},
  series: [],
  angleAxis: { data: [] }
}

export default class PolarDynamicDataConfig extends DynamicDataConfig {
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
    const { angleAxis, legend, series } = this
    return { angleAxis, legend, series }
  }

  async getRealDataOption () {
    const dataList = await this.resourceConfig.fetch()
    const groupByLegend = _.groupBy(dataList, 'legend')
    const legendList = Object.keys(groupByLegend)
    const groupByName = _.groupBy(dataList, 'name')
    const categoryList = Object.keys(groupByName)
    const option = {
      legend: {
        data: categoryList
      },
      angleAxis: {
        type: 'category',
        data: legendList
      },
      series: categoryList.map(name => ({
        name: name,
        data: groupByName[name].map(({ data }) => data)
      }))
    }
    Object.assign(this, option)
  }

  async getAlarmOption () {
    const dataList = await this.alarmConfig.fetch()
    const groupByOrigin = _.groupBy(dataList, 'name')
    const legendData = []
    const level1Collection = []
    const level2Collection = []
    const level3Collection = []
    const level4Collection = []
    const level5Collection = []
    Object
      .entries(groupByOrigin)
      .forEach(([origin, values]) => {
        values.forEach((value) => {
          // FIXME: 在数据域设计开发完成前，硬编码处理北京数据中心与厦门数据中心数据
          origin = origin
            .replace('BJ1', '北京数据中心')
            .replace('BJ2', '北京数据中心')
            .replace('XM1', '厦门数据中心')
            .replace('XM2', '厦门数据中心')
          legendData.push(`${origin}-${value.legend}`)
          level1Collection.push(value.level1)
          level2Collection.push(value.level2)
          level3Collection.push(value.level3)
          level4Collection.push(value.level4)
          level5Collection.push(value.level5)
        })
      })
    const option = {
      angleAxis: {
        type: 'category',
        data: legendData
      },
      legend: {
        data: [ '严重告警', '重大告警', '次要告警', '一般告警', '最新通知' ]
      },
      // series: Object.values(groupByOrigin)[0].map(({ level2 }) => level2)
      series: [
        // { data: [10, 20, 30, 50], stack: '严重告警', name: '严重告警' },
        { data: level1Collection, stack: '严重告警', name: '严重告警' },
        { data: level2Collection, stack: '重大告警', name: '重大告警' },
        { data: level3Collection, stack: '次要告警', name: '次要告警' },
        { data: level4Collection, stack: '一般告警', name: '一般告警' },
        { data: level5Collection, stack: '最新通知', name: '最新通知' }
      ]
    }
    Object.assign(this, option)
  }

  resetData () {
    Object.assign(this, _.cloneDeep(initialOption))
  }
}
