/*
 * @Author: cw
 * @Date: 2021-12-9 15:04:57
 * @LastEditTime: 2021-12-9 15:04:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web\src\model\element\MoreElement.js
 */
/**
 * More
 */
import _ from 'lodash'
import Element from '@/model/element/index'
import {
  SOURCE_TYPE_COMBO, SOURCE_TYPE_NULL, SOURCE_TYPE_OPEN,
  SOURCE_TYPE_OVERVIEW,
  SOURCE_TYPE_REAL, SOURCE_TYPE_SQL, SOURCE_TYPE_STATIC, SOURCE_TYPE_STATIC_TRAFFIC
} from '@/model/config/dataConfig/dynamicData/types/sourceType'

export default class MoreElement extends Element {
  async mappingOption ({ commonConfig, proprietaryConfig, dataConfig }, loadingDynamicData = false) {
    const { sourceType, staticDataConfig = {}, dbDataConfig } = dataConfig
    const { staticData } = staticDataConfig || {}
    const props = {
      dataSource: [],
      columns: []
    }

    switch (sourceType) {
      case SOURCE_TYPE_OVERVIEW:
      case SOURCE_TYPE_COMBO:
      case SOURCE_TYPE_REAL: {
        const { dataSource, columns } = await dbDataConfig.getOption(loadingDynamicData, sourceType)
        Object.assign(props, { dataSource, columns })
        break
      }
      case SOURCE_TYPE_STATIC: {
        if (staticData) {
          Object.assign(props, staticData)
        }
        break
      }
      case SOURCE_TYPE_NULL: {
        break
      }
      case SOURCE_TYPE_SQL: {
        const { dataSource, columns } = await dbDataConfig.getOption(loadingDynamicData, sourceType)
        Object.assign(props, { dataSource, columns })
        break
      }
      case SOURCE_TYPE_OPEN: {
        const { dataSource } = await dbDataConfig.getOption(loadingDynamicData, sourceType)
        Object.assign(props, { dataSource })
        break
      }
      case SOURCE_TYPE_STATIC_TRAFFIC: {
        const { dataSource, columns, siteId, type, cache, size } = await dbDataConfig.getOption(loadingDynamicData, sourceType)
        Object.assign(props, { dataSource, columns, siteId, type, cache, size })
        break
      }
    }
    return _.cloneDeep({
      ...props,
      ...proprietaryConfig.getOption()
    })
  }
}
