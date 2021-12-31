/**
 * 列表动态数据配置
 */

import { DynamicDataConfig } from './common/index'
import {
  SOURCE_TYPE_OVERVIEW,
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_COMBO,
  SOURCE_TYPE_SQL,
  SOURCE_TYPE_OPEN
} from './types/sourceType'
import _ from 'lodash'
import { STATUS_MAPPING } from '@/views/patrol/typing'

export default class ListDynamicDataConfig extends DynamicDataConfig {
  /**
   * 生成表格行与列
   * @param {Array} dataList 原始数据
   */
  generate (dataList = [], reverse = false) {
    const columns = []
    const dataSource = []
    if (_.isEmpty(dataList)) {
      return { columns, dataSource }
    }
    const groupByLegend = _.groupBy(dataList, 'legend')
    const groupByName = _.groupBy(dataList, 'name')

    // 切换行与列（默认列为指标，行为设备）
    if (this.resourceConfig.legendType === 'metric') {
      columns.push(
        {
          title: '指标',
          dataIndex: 'name',
          width: 300,
          ellipsis: true
        },
        ...Object.keys(groupByLegend).map((legend) => ({
          title: legend,
          dataIndex: legend
        }))
      )

      dataSource.push(
        ...Object.entries(groupByName).map(([name, list]) => {
          const result = { name }
          columns.forEach(({ dataIndex }) => {
            const target = list.find(({ legend }) => legend === dataIndex)
            if (target) {
              result[dataIndex] = target['data']
            }
          })
          return result
        })
      )
    } else {
      columns.push(
        { title: '设备', dataIndex: 'legend', width: 300, ellipsis: true },
        ...Object.keys(_.groupBy(dataList, 'name')).map((name) => ({
          title: name,
          dataIndex: name
        }))
      )

      dataSource.push(
        ...Object.entries(groupByLegend).map(([legend, list]) => {
          const result = { legend }
          columns.forEach(({ dataIndex }) => {
            const target = list.find(({ name }) => name === dataIndex)
            if (target) {
              result[dataIndex] = target['data']
            }
          })
          return result
        })
      )
      // columns.push(
      //   {
      //     title: '设备',
      //     dataIndex: 'legend',
      //     width: 300,
      //     ellipsis: true
      //   },
      //   ...Object.keys(groupByName).map((name) => ({
      //     title: name,
      //     dataIndex: name
      //   }))
      // )

      // dataSource.push(
      //   ...Object.entries(reverse ? groupByName : groupByLegend).map(([legend, list]) => {
      //     const result = { legend }
      //     columns.forEach(({ dataIndex }) => {
      //       const target = list.find(({ name }) => name === dataIndex)
      //       if (target) {
      //         result[dataIndex] = target['data']
      //       }
      //     })
      //     return result
      //   })
      // )
    }
    let count = columns.length
    count = 100 / 3
    columns.forEach(c => {
      c.width = count.toString() + '%'
    })
    return { columns, dataSource }
  }

  /*
  * 自定义sql生成对应的行和列
  * 页头自定义
  * 对应数据为legend data
  * */
  generateSql (dataList = [], reverse = false) {
    const columns = []
    const dataSource = []
    if (_.isEmpty(dataList)) {
      return { columns, dataSource }
    }
    // 表头
    const head = _.head(dataList)
    const body = _.slice(dataList, 1, dataList.length)
    head.map(el => { columns.push({ title: el, dataIndex: el, width: 300, ellipsis: true }) })

    body.map(el => {
      const result = {}
      el.forEach((value, index) => {
        const obj = columns[index].dataIndex
        // Object.assign(result, {columns[dataIndex]:value})
        if (obj === '状态') {
          value = STATUS_MAPPING.get(value)
        }
        result[obj] = value
      })
      dataSource.push(result)
    })
    let count = columns.length
    count = 100 / 3
    columns.forEach(c => {
      c.width = count.toString() + '%'
    })
    return { columns, dataSource }
  }
  generateOpenData (dataList = [], reverse = false) {
    const columns = []
    let dataSource = []
    if (_.isEmpty(dataList)) {
      return { columns, dataSource }
    }
    let lead = null
    try {
      lead = JSON.parse(this.openConfig.back)
    } catch (e) {
      this.$message.error('返回值填写错误，请检查是否为正确的JSON格式！')
      return
    }
    dataSource = this.dealOpen(dataList, lead)
    return { columns, dataSource }
  }

  dealOpen (data, lead) {
    const dataSource = []
    if (!lead) {
      return data
    }
    lead.key.forEach(k => {
      data = data[k]
    })
    data.forEach(d => {
      const obj = {}
      for (let i = 0; i < lead.index.length; i++) {
        let value = d[lead.index[i]]
        if (lead.mapping.length) {
          lead.mapping.forEach(m => {
            if (value in m) {
              value = m[value]
            }
          })
        }
        obj[lead.alias[i]] = value
      }
      dataSource.push(obj)
    })
    return dataSource
  }

  /**
   * 与静态数据保持一致的数据结构
   * @returns {Promise<any>}
   */
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
        case SOURCE_TYPE_SQL: {
          await this.getSqlDataOption()
          break
        }
        case SOURCE_TYPE_OPEN: {
          await this.getOpenDataOption()
          break
        }
      }
    }
    const { dataSource = [], columns = [] } = this
    return { dataSource, columns }
  }

  async getOverviewDataOption () {
    const dataList = await this.overviewConfig.fetch()

    const { columns, dataSource } = this.generate(dataList)

    Object.assign(this, {
      columns,
      dataSource
    })
  }

  async getRealDataOption () {
    const dataList = await this.resourceConfig.fetch()

    const { columns, dataSource } = this.generate(dataList, true)

    Object.assign(this, {
      columns,
      dataSource
    })
  }

  async getComboDataOption () {
    // 对应新接口网络请求
    const dataList = await this.comboConfig.fetch()
    const { columns, dataSource } = this.generate(dataList, true)
    Object.assign(this, {
      columns,
      dataSource
    })
  }

  async getSqlDataOption () {
    const dataList = await this.sqlConfig.fetch()
    const { columns, dataSource } = this.generateSql(dataList, false)
    Object.assign(this, {
      columns,
      dataSource
    })
  }
  async getOpenDataOption () {
    const dataList = await this.openConfig.fetch()
    const { columns, dataSource } = this.generateOpenData(dataList, false)
    Object.assign(this, {
      columns,
      dataSource
    })
  }
}
