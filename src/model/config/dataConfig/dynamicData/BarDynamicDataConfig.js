/**
 * 柱形图动态数据配置
 */

import _ from 'lodash'
import { DynamicDataConfig } from './common/index'
import {
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_ALARM,
  SOURCE_TYPE_COMBO,
  SOURCE_TYPE_NUMBER, SOURCE_TYPE_STATIC_TRAFFIC
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
        case SOURCE_TYPE_COMBO: {
          await this.getComboDataOption()
          break
        }
        case SOURCE_TYPE_NUMBER: {
          await this.getNumberDataOption()
          break
        }
        case SOURCE_TYPE_STATIC_TRAFFIC: {
          await this.getSiteTrafficOption()
          break
        }
      }
    }
    const { legend, xAxis, yAxis, series, dataset } = this
    return { legend, xAxis, yAxis, series, dataset }
  }

  async getRealDataOption () {
    const dataList = await this.resourceConfig.fetch()
    const groupByModel = _.groupBy(dataList, el => el.endpointModelAlias + el.metric)
    const groupByInstance = _.groupBy(dataList, 'endpointAlias')

    const option = {
      legend: {
        data: Object.keys(groupByInstance)
      },
      xAxis: {
        type: 'category',
        data: Object.keys(groupByModel)
      },
      yAxis: { type: 'value' },
      series: Object.entries(groupByInstance).map(([key, value]) => ({
        name: key,
        data: value.map(({ data }) => data)
      }))
    }

    Object.assign(this, option)
  }

  async getAlarmOption () {
    const dataList = await this.alarmConfig.fetch()
    const option = {
      legend: {
        data: [ '紧急告警', '主要告警', '次要告警', '一般告警', '最新通知' ]
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
          name: '紧急告警',
          data: dataList.map(({ level1 }) => level1)
        },
        {
          name: '主要告警',
          data: dataList.map(({ level2 }) => level2)
        },
        {
          name: '次要告警',
          data: dataList.map(({ level3 }) => level3)
        },
        {
          name: '一般告警',
          data: dataList.map(({ level4 }) => level4)
        }
        // 暂不展示5级告警
        // {
        //   name: '最新通知',
        //   data: dataList.map(({ level5 }) => level5)
        // }
      ]

    }
    Object.assign(this, option)
  }
  async getNumberDataOption () {
    const dataList = await this.numberConfig.fetch()
    const option = {
      legend: {},
      xAxis: {
        type: 'category',
        data: dataList.map(el => el[0]).reverse()
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: dataList.map(el => el[1]).reverse()
      }]
    }
    Object.assign(this, option)
  }

  async getComboDataOption () {
    const dataList = await this.comboConfig.fetch()
    const groupByLegend = _.groupBy(dataList, 'legend')
    const legendList = Object.keys(groupByLegend)
    const groupByName = _.groupBy(dataList, 'name')
    const nameList = Object.keys(groupByName)
    const option = {
      legend: {},
      xAxis: { type: 'category' },
      yAxis: { type: 'value' },
      dataset: {
        dimensions: ['name', ...legendList],
        source: [
          ...nameList.map(name => {
            const result = { name }
            groupByName[name].forEach(({ legend, data }) => {
              result[legend] = data
            })
            return result
          })
        ]
      },
      series: legendList.map(() => ({
        type: 'bar'
      }))
    }
    Object.assign(this, option)
  }

  async getSiteTrafficOption () {
    const { data: { top } } = await this.siteTrafficConfig.fetchBar()
    const option = {
      legend: {
        data: [ '重要告警', '一般告警', '次要告警' ]
      },
      xAxis: {
        type: 'category',
        data: top.map(({ siteName }) => siteName)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '重要告警',
          data: top.map(({ critical }) => critical)
        },
        {
          name: '一般告警',
          data: top.map(({ major }) => major)
        },
        {
          name: '次要告警',
          data: top.map(({ trivial }) => trivial)
        }
      ]
    }
    Object.assign(this, option)
  }

  resetData () {
    Object.assign(this, _.cloneDeep(initialOption))
  }
}
