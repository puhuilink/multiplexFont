/**
* 数据配置
* Author: dong xing
* Date: 2019/11/20
* Time: 5:12 下午
* Email: dong.xing@outlook.com
*/
import Factory from '@/model/factory/factory'
import { SOURCE_TYPE_STATIC, SOURCE_TYPE_NULL } from './dynamicData/types/sourceType'

const StaticDataConfigFactory = Factory.createStaticDataConfigFactory()
const CreateDynamicDataFactory = Factory.createDynamicDataFactory()

export default class DataConfig {
  constructor ({
    sourceType = SOURCE_TYPE_STATIC,
    widgetType,
    staticDataConfig = {},
    dbDataConfig = {}
  }) {
    this.sourceType = sourceType
    this.staticDataConfig = StaticDataConfigFactory.create(widgetType, staticDataConfig)
    this.dbDataConfig = CreateDynamicDataFactory.create(widgetType, dbDataConfig)
  }

  /**
   * 获取当前启用的 config
   */
  getCurrentConfig () {
    switch (this.sourceType) {
      case SOURCE_TYPE_STATIC:
        return this.staticDataConfig || {}
      case SOURCE_TYPE_NULL:
        return {}
      default:
        return this.dbDataConfig.getCurrentConfig(this.sourceType) || {}
    }
  }
}
