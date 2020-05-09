import { BaseService } from './BaseService'
import {
  ModelDao,
  InstanceDao,
  RelationAttributeDao,
  RelationInstanceDao
} from '../dao/index'
import { mutate, query } from '../utils/hasura-orm/index'
import axios from 'axios'
import _ from 'lodash'

class ModelService extends BaseService {
  /**
   * 新增模型节点
   * @param {Objetc} model
   * @return {Promise<any>}
   */
  static async add (model = {}) {
    try {
      await mutate(
        ModelDao.add(model)
      )
      // await ModelDao.add(model).mutate()
    } catch (e) {
      throw e
    }
  }

  static async addAttr (attr = {}, where = {}) {
    const res = await mutate(
      ModelDao.addAttr(attr, where)
    )
    console.log(res)
  }

  /**
   * 更新模型节点
   * @param {Objetc} model
   * @return {Promise<any>}
   */
  static async update (model, where) {
    await mutate(
      ModelDao.update(model, where)
    )
  }

  static async find (argus = {}) {
    const res = await query(
      ModelDao.find(argus)
    )
    return res
  }

  static async list (argus = {}) {
    const { values, name } = argus.where

    if (values && !_.isEmpty(values)) {
      const sql = `
      SELECT
        "_id"
      FROM 
        t_cmdb_model AS T 
      WHERE
        "name" = '${name._eq || name}'
      AND
        ${values}
      `

      console.log(sql)

      const { data: { result } } = await axios({
        url: '/main/v1/query',
        method: 'POST',
        data: {
          'type': 'run_sql',
          'args': {
            'sql': sql
          }
        },
        headers: {
          'x-hasura-admin-secret': 'zhongjiao'
        }
      })

      // 第一个为查询的字段集合？
      result.shift()

      if (result.length) {
        const res = await this.find({
          ...argus,
          where: {
            _and: {
              ..._.omit(argus.where, 'values'),
              _id: {
                _in: result.flat()
              }
            }
          }
        })

        return res
      } else {
        const res = await this.find({
          ...argus,
          where: _.omit(argus.where, ['values'])
        })
        return res
      }
    } else {
      const res = await this.find({
        ...argus,
        where: _.omit(argus.where, ['values'])
      })
      return res
    }
  }

  static async delete (nameList = []) {
    // 模型下挂载的实例节点
    const { data: { instanceList } } = await query(
      InstanceDao.find({ where: { parentName: { _in: nameList } }, fields: ['name'], alias: 'instanceList' })
    )
    const instanceNameList = instanceList.map(({ name }) => name)

    await mutate(
      // 资源模型删除
      ModelDao.batchDelete({ name: { _in: nameList } }),
      // 模型关系属性删除
      RelationAttributeDao.batchDelete({ source: { _in: nameList } }),
      // 其挂载的资源实例也删除
      InstanceDao.batchDelete({ parentName: { _in: nameList } }),
      // 其挂载的资源实例的（被）关联实例
      RelationInstanceDao.batchDelete({
        _or: [
          { source: { _in: instanceNameList } },
          { target: { _in: instanceNameList } }
        ]
      })
    )

    // TODO: 日志与版本
  }
}

export {
  ModelService
}
