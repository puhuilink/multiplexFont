import { BaseService } from './BaseService'
import {
  ModelDao,
  InstanceDao,
  RelationAttributeDao,
  RelationInstanceDao
} from '../dao/index'
import { mutate, query } from '../utils/hasura-orm/index'
import _ from 'lodash'
import { MAIN_AXIOS } from '@/utils/hasuraAxios'

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
   * 获取模型下的属性（模型属性，关系属性分组等信息）
   * @param {String} name 模型 name
   */
  static async attrInfo (name) {
    const { data } = await query(
      // 模型自身属性
      ModelDao.find({
        where: {
          name
        },
        fields: ['attributes'],
        alias: 'modelList'
      }),
      // 模型关联属性 (base)
      RelationAttributeDao.find({
        where: {
          source: name
        },
        // Dao 层已配置全量 field，默认查询出所有字段
        alias: 'relationAttributes'
      })
    )
    const { modelList: [model], relationAttributes } = data
    const { attributes } = model
    return {
      attributes,
      relationAttributes
    }
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

  static async updateAttr (modelName, attr = {}) {
    const { name: attrName } = attr
    const sql = `
      UPDATE 
        t_cmdb_model t1 
      SET 
        attributes = jsonb_set (
          attributes,
          
          ARRAY [ (
            SELECT 
              ORDINALITY::INT - 1 
            FROM
              t_cmdb_model t2,
              jsonb_array_elements ( attributes ) WITH ORDINALITY 
            WHERE
              t1._id = t2._id
            AND 
              VALUE->> 'name' = '${attrName}' 
            ) :: TEXT],
            
            '${JSON.stringify(attr)}' 
        ) 
      WHERE
        name = '${modelName}'
    `
    // console.log(sql)

    await MAIN_AXIOS.sql(sql)
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

      const { data: { result } } = await MAIN_AXIOS(sql)

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

  static async batchDelete (nameList = []) {
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

  static async batchDeleteAttr (modelName, attrNameList = []) {
    const sql = `
      UPDATE
        t_cmdb_model
      SET
        attributes = (
          SELECT COALESCE(
            (SELECT
              jsonb_agg(elements.value) AS attributes
            FROM
                t_cmdb_model,
                jsonb_array_elements(attributes) AS elements
            WHERE 
              name = '${modelName}'
            AND
              elements.value ->> 'name' NOT IN (${attrNameList.map(attrName => `'${attrName}'`).join(', ')})
            GROUP BY _id),
            '[]'
          )
        )
      WHERE
        name = '${modelName}'
    `

    await MAIN_AXIOS(sql)
  }
}

export {
  ModelService
}
