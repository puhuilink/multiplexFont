/**
 * 折线图动态数据配置
 */

import { DynamicDataConfig } from './common/index'
import _ from 'lodash'
import {
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_OVERVIEW,
  SOURCE_TYPE_COMBO, SOURCE_TYPE_STATIC_TRAFFIC, SOURCE_TYPE_CPE
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
        case SOURCE_TYPE_STATIC_TRAFFIC: {
          await this.getSiteTrafficOption()
          break
        }
        case SOURCE_TYPE_CPE: {
          await this.getSiteCpeOption()
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

  async getSiteTrafficOption () {
    switch (this.siteTrafficConfig.requestType) {
      case 'wan':
        await this.generateWanData()
        break
      case 'delay':
        await this.generateDelayData()
        break
      case 'packet':
        await this.generatePacketData()
        break
      default:
        await this.generateWanData()
    }
  }
  async generateWanData () {
    const { data: { throughput } } = await this.siteTrafficConfig.requestData()
    const option = {
      legend: {
        data: throughput ? [Object.keys(throughput[0])[0] + '(' + throughput[0].unit + ')', Object.keys(throughput[0])[1] + '(' + throughput[0].unit + ')'] : []
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: throughput ? _.uniq(
          throughput.map(({ time }) => time)
        ) : []
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: Object.keys(throughput[0])[0] + '(' + throughput[0].unit + ')',
        data: throughput.map(({ rx }) => rx.toFixed(2))
      }, {
        name: Object.keys(throughput[0])[1] + '(' + throughput[0].unit + ')',
        data: throughput.map(({ tx }) => tx.toFixed(2))
      }
      ]
    }
    Object.assign(this, option)
  }
  async generateDelayData () {
    const { data: { loss } } = await this.siteTrafficConfig.requestData()
    const option = {
      legend: {
        data: ['loss', 'latency']
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: loss ? _.uniq(
          loss.map(({ time }) => time)
        ) : []
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'loss',
        data: loss.map(({ loss }) => loss.toFixed(2))
      }, {
        name: 'latency',
        data: loss.map(({ latency }) => latency.toFixed(2))
      }
      ]
    }
    Object.assign(this, option)
  }
  async generatePacketData () {
    const { data: { packet } } = await this.siteTrafficConfig.requestData()
    const option = {
      legend: {
        data: ['rxPacket', 'txPacket']
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: packet ? _.uniq(
          packet.map(({ time }) => time)
        ) : []
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'rxPacket',
        data: packet.map(({ rxPacket }) => rxPacket.toFixed(2))
      }, {
        name: 'txPacket',
        data: packet.map(({ txPacket }) => txPacket.toFixed(2))
      }
      ]
    }
    Object.assign(this, option)
  }

  async getSiteCpeOption () {
    const { data: { cpu, mem } } = await this.siteCpeConfig.fetch()
    const option = {
      legend: {
        data: ['cpu利用率(%)', '内存利用率(%)']
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: _.uniq(
          cpu.map(({ time }) => time)
        )
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'cpu利用率(%)',
        data: cpu.map(({ usage }) => usage.toFixed(2))
      }, {
        name: '内存利用率(%)',
        data: mem.map(({ usage }) => usage.toFixed(2))
      }
      ]
    }
    Object.assign(this, option)
  }

  // 对外数据转换接口，支持直接以数据生成柱形图配置
  static transferComboDataOption (dataList) {
    const groupByLegend = _.groupBy(dataList, 'legend')
    const groupByName = _.groupBy(dataList, 'name')
    const aggregate = Object.keys(groupByLegend).length > 1 ? groupByLegend : groupByName
    const categoryList = Object.keys(aggregate)
    return {
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
        type: 'line',
        name: category,
        data: aggregate[category].map(({ data }) => data),
        itemStyle: {
          color: '#7ed3f4'
        }
      }))
    }
  }

  async getComboDataOption () {
    const dataList = await this.comboConfig.fetch()
    const option = LinesDynamicDataConfig.transferComboDataOption(dataList)
    Object.assign(this, option)
  }

  resetData () {
    Object.assign(this, _.cloneDeep(initialOption))
  }
}
