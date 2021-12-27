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
  SOURCE_TYPE_COMBO, SOURCE_TYPE_NULL,
  SOURCE_TYPE_OVERVIEW,
  SOURCE_TYPE_REAL, SOURCE_TYPE_SQL, SOURCE_TYPE_STATIC
} from '@/model/config/dataConfig/dynamicData/types/sourceType'

export default class TabElement extends Element {
  async mappingOption ({ commonConfig, proprietaryConfig, dataConfig }, loadingDynamicData = false) {
    console.log('私有配置', proprietaryConfig.getOption())
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
    }
    return _.cloneDeep({
      data: props,
      ...proprietaryConfig.getOption(),
      common: commonConfig
    })
  }

  async mergeOption (config, loadingDynamicData = false) {
    console.log(config)
    await super.mergeOption(config, loadingDynamicData)
    // this.$EventBus.$emit('merge', null)
  }
  resize (config) {
    super.resize()
    this.mergeOption(config)
  }
  setStyle (config) {
    super.setStyle(config)
    this.resize(config)
  }
}
