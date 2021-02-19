/**
 * 折线图动态数据配置
 */

import { DynamicDataConfig } from './common/index'
import _ from 'lodash'
import {
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_OVERVIEW,
  SOURCE_TYPE_COMBO
} from './types/sourceType'

const initialOption = {
  legend: {},
  xAxis: {},
  yAxis: {},
  series: []
}

export default class LinesDynamicDataConfig extends DynamicDataConfig {
  async getOption (loadingDynamicData, sourceType) {
    if (loadingDynamicData) {
      switch (sourceType) {
        case SOURCE_TYPE_REAL: {
          await this.getRealDataOption()
          break
        }
        case SOURCE_TYPE_OVERVIEW: {
          await this.getOverviewDataOption()
          break
        }
        case SOURCE_TYPE_COMBO: {
          await this.getComboDataOption()
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
    const groupByName = _.groupBy(dataList, 'name')
    const aggregate = Object.keys(groupByLegend).length > 1 ? groupByLegend : groupByName
    const categoryList = Object.keys(aggregate)
    const option = {
      legend: {
        data: categoryList
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: _.uniq(
          dataList.map(({ time }) => time)
        )
      },
      yAxis: {
        type: 'value'
      },
      series: categoryList.map(category => ({
        name: category,
        data: aggregate[category].map(({ data }) => data)
      }))
    }
    Object.assign(this, option)
  }

  async getOverviewDataOption () {
    const dataList = await this.overviewConfig.fetch()
    const groupByLegend = _.groupBy(dataList, 'legend')
    const legendList = Object.keys(groupByLegend)
    const option = {
      legend: {
        data: legendList
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: _.uniq(
          dataList.map(({ time }) => time)
        )
      },
      yAxis: {
        type: 'value'
      },
      series: legendList.map(legend => ({
        name: legend,
        data: groupByLegend[legend].map(({ data }) => data)
      }))
    }
    Object.assign(this, option)
  }

  async getComboDataOption () {
    const dataList = await this.comboConfig.fetch()
    const groupByLegend = _.groupBy(dataList, 'legend')
    const groupByName = _.groupBy(dataList, 'name')
    const aggregate = Object.keys(groupByLegend).length > 1 ? groupByLegend : groupByName
    const categoryList = Object.keys(aggregate)
    const option = {
      legend: {
        data: categoryList
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: _.uniq(
          dataList.map(({ time }) => time)
        )
      },
      yAxis: {
        type: 'value'
      },
      series: categoryList.map(category => ({
        name: category,
        data: aggregate[category].map(({ data }) => data)
      }))
    }
    Object.assign(this, option)
  }

  resetData () {
    Object.assign(this, _.cloneDeep(initialOption))
  }
}
