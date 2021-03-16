/*
 * @Author: xcs
 * @Date: 2021-03-16 16:54:57
 * @LastEditTime: 2021-03-16 17:27:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web\src\model\element\ListElement.js
 */
/**
* 列表
*/
import Element from './index'
import {
  SOURCE_TYPE_COMBO,
  SOURCE_TYPE_NULL,
  SOURCE_TYPE_OVERVIEW,
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_STATIC
} from '../config/dataConfig/dynamicData/types/sourceType'
import _ from 'lodash'

export default class ListElement extends Element {
  async mappingOption ({ proprietaryConfig, dataConfig }, loadingDynamicData = false) {
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
    }

    return _.cloneDeep({
      ...props,
      ...proprietaryConfig.getOption()
    })
  }
}
