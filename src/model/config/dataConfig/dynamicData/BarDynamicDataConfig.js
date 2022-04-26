/**
 * 柱形图动态数据配置
 */

import _ from 'lodash'
import { DynamicDataConfig } from './common/index'
import {
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_ALARM,
  SOURCE_TYPE_COMBO,
  SOURCE_TYPE_NUMBER, SOURCE_TYPE_STATIC_TRAFFIC, SOURCE_TYPE_CPE
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
        case SOURCE_TYPE_CPE: {
          await this.getCpeOption()
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
    let option
    switch (this.siteTrafficConfig.apiType) {
      case 'sdwan':
        option = this.generateSDWanOption(top)
        break
      case 'mv':
        option = this.generateMVOption(top)
    }
    Object.assign(this, option)
  }
  async getCpeOption () {
    const { data: { top } } = await this.siteCpeConfig.fetch()
    let option
    switch (this.siteTrafficConfig.apiType) {
      case 'sdwan':
        option = this.generateSDWanOption(top)
        break
      case 'mv':
        option = this.generateMVSiteOption(top)
    }
    Object.assign(this, option)
  }

  generateSDWanOption (top) {
    top = top.reverse()
    return {
      legend: {
        data: [ '紧急', '重要', '一般' ]
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
          name: '紧急',
          data: top.map(({ critical }) => critical)
        },
        {
          name: '重要',
          data: top.map(({ major }) => major)
        },
        {
          name: '一般',
          data: top.map(({ trivial }) => trivial)
        }
      ]
    }
  }

  resetData () {
    Object.assign(this, _.cloneDeep(initialOption))
  }

  generateMVOption (top) {
    top = top.reverse()
    return {
      legend: {
        data: top.map(({ pointName }) => pointName),
        show: false
      },
      xAxis: {
        type: 'category',
        data: top.map(({ pointName }) => pointName)
      },
      yAxis: {
        type: 'value',
        axisLabel: {// 坐标轴刻度标签的相关设置。
          formatter: function (params) {
            let newParamsName = ''// 最终拼接成的字符串
            const paramsNameNumber = params.length// 实际标签的个数
            const provideNumber = 15// 每行能显示的字的个数
            const rowNumber = Math.ceil(paramsNameNumber / provideNumber)// 换行的话，需要显示几行，向上取整
            /**
             * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
             */
            // 条件等同于rowNumber>1
            if (paramsNameNumber > provideNumber) {
              /** 循环每一行,p表示行 */
              for (let p = 0; p < rowNumber; p++) {
                let tempStr = ''// 表示每一次截取的字符串
                const start = p * provideNumber// 开始截取的位置
                const end = start + provideNumber// 结束截取的位置
                // 此处特殊处理最后一行的索引值
                if (p === rowNumber - 1) {
                  // 最后一次不换行
                  tempStr = params.substring(start, paramsNameNumber)
                } else {
                  // 每一次拼接字符串并换行
                  tempStr = params.substring(start, end) + '\n'
                }
                newParamsName += tempStr// 最终拼成的字符串
              }
            } else {
              // 将旧标签的值赋给新标签
              newParamsName = params
            }
            return newParamsName
          },
          interval: 0

        }
      },
      series: top.map(({ pointName, total }, index) => {
        const arr = new Array(top.length)
        arr[index] = total
        return {
          name: pointName,
          data: arr
        }
      })
    }
  }
  generateMVSiteOption (top) {
    top = top.reverse()
    return {
      xAxis: {
        type: 'category',
        data: top.map(({ originSiteName, peerSiteName }) => originSiteName + ' to ' + peerSiteName)
      },
      yAxis: {
        type: 'value',
        axisLabel: {// 坐标轴刻度标签的相关设置。
          formatter: function (params) {
            let newParamsName = ''// 最终拼接成的字符串
            const paramsNameNumber = params.length// 实际标签的个数
            const provideNumber = 15// 每行能显示的字的个数
            const rowNumber = Math.ceil(paramsNameNumber / provideNumber)// 换行的话，需要显示几行，向上取整
            /**
             * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
             */
            // 条件等同于rowNumber>1
            if (paramsNameNumber > provideNumber) {
              /** 循环每一行,p表示行 */
              for (let p = 0; p < rowNumber; p++) {
                let tempStr = ''// 表示每一次截取的字符串
                const start = p * provideNumber// 开始截取的位置
                const end = start + provideNumber// 结束截取的位置
                // 此处特殊处理最后一行的索引值
                if (p === rowNumber - 1) {
                  // 最后一次不换行
                  tempStr = params.substring(start, paramsNameNumber)
                } else {
                  // 每一次拼接字符串并换行
                  tempStr = params.substring(start, end) + '\n'
                }
                newParamsName += tempStr// 最终拼成的字符串
              }
            } else {
              // 将旧标签的值赋给新标签
              newParamsName = params
            }
            return newParamsName
          },
          interval: 0

        }
      },
      series: [
        {
          name: '丢包',
          data: top.map(({ loss }) => loss)
        },
        {
          name: '抖动',
          data: top.map(({ latency }) => latency)
        }
      ]
    }
  }
}
