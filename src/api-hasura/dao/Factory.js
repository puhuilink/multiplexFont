import _ from 'lodash'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

/**
 * 静态文件工厂
 */
export class StaticFactory {
  static create = () => {
    const requirePlugins = require.context('./', true, /\Dao.js$/)
    const exposed = {}

    requirePlugins.keys().forEach((fileName) => {
      const className = fileName.replace(/(\.)*(\/)*(js)*/g, '')
      exposed[className] = requirePlugins(fileName)[className]
    })

    return exposed
  }
}

/**
 * 动态配置工厂
 */
export class DynamicFactory {
  static create = mapping => {
    const exposed = {};
    [...mapping].forEach(([SCHEMA, PROVIDER]) => {
      const className = _.upperFirst(
        _.camelCase(
          SCHEMA.replace(/^[t_v_]/g, '')
        )
      ) + 'Dao'
      exposed[className] = class extends BaseDao {
        @readonly
        static SCHEMA = SCHEMA

        @readonly
        static PROVIDER = PROVIDER
      }
    })

    return exposed
  }
}
