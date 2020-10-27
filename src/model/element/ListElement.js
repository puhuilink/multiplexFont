/**
* 列表
*/
import Element from './index'
import {
  SOURCE_TYPE_NULL,
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_STATIC
} from '../config/dataConfig/dynamicData/types/sourceType'
import _ from 'lodash'

export default class ListElement extends Element {
  async mergeOption ({ commonConfig, proprietaryConfig, dataConfig }, loadingDynamicData = false) {
    const { sourceType, staticDataConfig: { staticData } } = dataConfig
    const props = {
      ..._.pick(commonConfig, ['height', 'width']),
      dataSource: [],
      columns: []
    }

    switch (sourceType) {
      case SOURCE_TYPE_REAL: {
        break
      }
      case SOURCE_TYPE_STATIC: {
        Object.assign(props, staticData)
        break
      }
      case SOURCE_TYPE_NULL: {
        break
      }
    }

    this.updateProps(_.cloneDeep({
      ...props,
      ...proprietaryConfig.getOption()
    }))
  }
}
