import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
// eslint-disable-next-line no-unused-vars
import { override, readonly } from 'core-decorators'
import { defaultInfo } from '../utils/mixin/autoComplete'
import { varcharUuid } from '@/utils/util'
import { stringify } from '../utils/hasura-orm/helper'
import { parse } from 'graphql'

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

  static async add ({ values, ...baseInfo }) {
    // TODO: 校验
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
    // TODO: 校验
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
