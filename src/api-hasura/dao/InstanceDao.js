import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
// eslint-disable-next-line no-unused-vars
import { override, readonly } from 'core-decorators'
import { defaultInfo } from '../utils/mixin/autoComplete'
import { varcharUuid } from '@/utils/util'
import { stringify } from '../utils/hasura-orm/helper'
import { parse } from 'graphql'
import { ModelDao } from './index'
import { query } from '../utils/hasura-orm'
import _ from 'lodash'

class InstanceDao extends BaseDao {
  @readonly
  static SCHEMA = 't_cmdb_instance'
  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([
    ['_id', '_id'],
    ['name', '名称'],
    ['label', '显示名称']
  ])

  static async _uniqueValidate ({ values, parentName, _id }, isAdd = true) {
    return new Promise(async (resolve, reject) => {
      const uniquenessAttrList = await ModelDao.uniquenessAttrList(parentName)
      // 没有唯一字段要求
      if (_.isEmpty(uniquenessAttrList)) {
        resolve(true)
      } else {
        // 要校验的唯一字段 name
        const uniquenessAttrNameList = uniquenessAttrList.map(({ name }) => name)
        const obj = {}
        uniquenessAttrNameList.forEach(name => {
          if (values[name]) {
            obj[name] = values[name]
          }
        })
        const { data } = await query(
          ...Object.entries(obj).map(([key, val], index) => InstanceDao.find({
            where: { [key]: val },
            fields: _.uniq(['_id', key]),
            alias: key
          }))
        )
        // console.log(data)
        const errList = []
        for (const [key, instanceList] of Object.entries(data)) {
          if (instanceList.length) {
            if (isAdd) {
              const { label } = uniquenessAttrList.find(({ name }) => name === key)
              errList.push(`当前模型节点下已存在${label}为${values[key]}的实例`)
            } else {
              const conflictList = instanceList.filter(instance => instance['_id'] !== _id)
              if (conflictList.length) {
                const { label } = uniquenessAttrList.find(({ name }) => name === key)
                errList.push(`当前模型节点下已存在${label}为${values[key]}的实例`)
              }
            }
          }
        }
        _.isEmpty(errList) ? resolve(true) : reject(errList.join('<br />'))
      }
    })
  }

  static async add ({ values, ...baseInfo }) {
    await this._uniqueValidate({ values, ...baseInfo })
    const name = baseInfo.name || values.name
    const label = baseInfo.label || values.label
    const data = {
      // values,
      ...baseInfo,
      name,
      label,
      _id: varcharUuid(),
      version: 0,
      ...defaultInfo('createTime', 'creator')
    }
    const { SCHEMA, PROVIDER } = this
    const mutation = parse(`
      mutation ($values: jsonb) {
        insert_${SCHEMA} (
          objects: [
            {
              ${stringify(data)},
              values: $values
            }
          ]
        ) {
          returning {
            _id
          }
        }
      }
    `)
    // return super.add(data)
    return PROVIDER.mutate({
      mutation,
      variables: {
        values
      }
    })
  }

  static async update ({ values, ...baseInfo }, where) {
    await this._uniqueValidate({ values, ...baseInfo }, false)
    const name = baseInfo.name || values.name
    const label = baseInfo.label || values.label
    const data = {
      ...baseInfo,
      name,
      label,
      // TODO: version++
      // version: 0,
      ...defaultInfo('updateTime', 'updator')
    }
    // console.log(data)
    const { PROVIDER, SCHEMA } = this
    const mutation = `mutation ($values: jsonb, $where: ${SCHEMA}_bool_exp!) {
      update_${SCHEMA} (
        where: $where
        _set: {
          ${stringify(data)},
          values: $values
        }  
      ) {  returning { _id  } } }
      `
    // console.log(mutation)
    return PROVIDER.mutate({
      mutation: parse(mutation),
      variables: {
        values,
        where
      }
    })
  }
}

export {
  InstanceDao
}
