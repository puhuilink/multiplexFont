/**
 * 列表动态数据配置
 */

import { DynamicDataConfig } from './common/index'
import { SOURCE_TYPE_REAL } from './types/sourceType'
import _ from 'lodash'

export default class ListDynamicDataConfig extends DynamicDataConfig {
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
      }
    }
    const { dataSource = [], columns = [] } = this
    return { dataSource, columns }
  }

  async getRealDataOption () {
    const columns = []
    const dataSource = []
    const dataList = await this.resourceConfig.fetch()
    const groupByLegend = _.groupBy(dataList, 'legend')

    if (!_.isEmpty(dataList)) {
      columns.push(
        { title: '设备', dataIndex: 'legend', width: 300, ellipsis: true },
        ...Object.keys(_.groupBy(dataList, 'name')).map((name) => ({
          title: name,
          dataIndex: name
        }))
      )
    }

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

    Object.assign(this, {
      columns,
      dataSource
    })
  }
}
