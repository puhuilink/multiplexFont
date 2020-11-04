import _ from 'lodash'
import { BaseDao } from './BaseDao'

/**
 * 静态类工厂
 */
export class StaticFactory {
  static create = () => {
    const requirePlugins = require.context('./', true, /Dao.js$/)
    const exposed = {}

    requirePlugins.keys().forEach((fileName) => {
      const className = fileName.replace(/(\.)*(\/)*(js)*/g, '')
      exposed[className] = requirePlugins(fileName)[className]
    })

    return exposed
  }
}

/**
 * 动态类工厂
 */
export class DynamicFactory {
  static create = mapping => {
    const exposed = {};
    [...mapping].forEach(([schema, config]) => {
      const className = _.upperFirst(
        _.camelCase(
          schema.replace(/^[t_v_]/g, '')
        )
      ) + 'Dao'

      // 已通过静态类创建则跳过
      if (exposed[className]) return
      const { primaryKey, provider } = config

      exposed[className] = class extends BaseDao {
        static SCHEMA = schema

        static PROVIDER = provider

        static PRIMARY_KEY = primaryKey
      }
    })

    return exposed
  }
}

const { IMP_DAP_MAPPING } = require('../config/daoMapping.js')

const exposed = {
  ...StaticFactory.create(),
  ...DynamicFactory.create(IMP_DAP_MAPPING)
}

module.exports = exposed
