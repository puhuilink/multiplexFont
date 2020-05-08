/* eslint-disable indent */
import { BaseService } from './BaseService'
import { InstanceDao, RelationInstanceDao } from '../dao/index'
import { query } from '../utils/hasura-orm/index'
import _ from 'lodash'
import axios from 'axios'

class InstanceService extends BaseService {
  static async find (argus = {}) {
    const res = await query(
      InstanceDao.find(argus)
    )
    return res
  }

  /**
   * 实例详情
   * @param {String} _id 实例 id
   * @return {Promise<any>}
   */
  static async detail (_id) {
    const { data: { instanceList, pointOutInstanceList, pointInInstanceList } } = await query(
      // 实例
      InstanceDao.find({
        where: {
          _id
        },
        fields: [
          '_id',
          'name',
          'label',
          'values'
        ],
        alias: 'instanceList'
      }),
      // 实例的关联实例（指出）
      RelationInstanceDao.find({
        where: {
          instanceId: _id
        },
        fields: [
          '_id',
          'target',
          'source',
          'name'
        ],
        alias: 'pointOutInstanceList'
      }),
      // 被哪些实例关联（指入）
      RelationInstanceDao.find({
        where: {
          targetId: _id
        },
        fields: [
          '_id',
          'source',
          'target',
          'name'
        ],
        alias: 'pointInInstanceList'
      })
    )

    const [instance] = instanceList
    Object.assign(instance, {
      pointInInstanceList,
      pointOutInstanceList
    })
    console.log(instance)

    return instance
  }

  /**
   * @param {*} argus 同 find
   */
  static async list (argus = {}) {
    const { values, parentName } = argus.where

    const sql = `
      SELECT
        "_id"
      FROM 
        t_cmdb_instance AS T 
      WHERE
        "parentName" = '${parentName._eq}'
      AND
        ${
          _.isEmpty(values) ? true
          : Object
            .entries(values)
            .map(([key, value]) => `values->>'${key}' LIKE '%${value}%'`)
            .join(' AND ')
        }
      `

    console.log(sql)

    const { data: { result } } = await axios({
        url: 'http://10.1.13.17:31490/v1/query',
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

    // console.log(argus)
    // 第一个为查询的字段集合？
    result.shift()

    const res = this.find({
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
    // return result.flat()
  }
}

export {
  InstanceService
}
