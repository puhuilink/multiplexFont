import _ from 'lodash'
import { BaseDao } from './BaseDao'
import { IMP_DAO_MAPPING } from '../config/daoMapping'

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

module.exports = {
  ...DynamicFactory.create(IMP_DAO_MAPPING),
  ...StaticFactory.create()
}
