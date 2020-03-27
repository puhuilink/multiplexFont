/**
 * 动态数据工厂
 */

import GaugaDataConfig from '../config/dataConfig/dynamicData/GaugaDataConfig'

export default class DynamicDataFactory {
  static create (dbDataConfig) {
    return new GaugaDataConfig(dbDataConfig)
  }
}
