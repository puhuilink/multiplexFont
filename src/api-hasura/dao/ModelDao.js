import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
import { defaultInfo } from '../utils/mixin/autoComplete'
import { override, readonly } from 'core-decorators'
import { varcharUuid } from '@/utils/util'
import _ from 'lodash'
import { MAIN_AXIOS } from '@/utils/hasuraAxios'

class ModelDao extends BaseDao {
  // 对应 hasura schema
  @readonly
  static SCHEMA = 't_cmdb_model'

  // 对应 vue-apollo
  @readonly
  static PROVIDER = alert

  // 唯一字段
  @readonly
  static UNIQUE_FIELDS = ['name']

  // 主键
  @readonly
  static PRIMARY_KEY = 'name'

  // 字段与显示文字
  @readonly
  static FIELDS_MAPPING = new Map([
    ['name', '名称']
  ])

  @override
  static async add (model) {
    // 验证唯一字段是否有冲突
    await this._uniqueValidate(model)
    return super.add({
      _id: varcharUuid(),
      attributes: [],
      ...model,
      ...defaultInfo('createTime', 'creator')
    })
  }

  @override
  static async update ({ ...model }, { _id }) {
    await this._uniqueValidate({ ...model, _id }, false)
    return super.update({ ...model, ...defaultInfo('updateTime', 'updator') }, { _id })
  }

  static async _validateAttrName (modelName, attrName) {
    const { SCHEMA } = this
    return new Promise(async (resolve, reject) => {
      const sql = `
        SELECT
          jsonb_agg(elements.value) AS attributes
        FROM
            ${SCHEMA},
            jsonb_array_elements(attributes) AS elements
        WHERE 
          name = '${modelName}'
        AND
          elements.value ->> 'name' = '${attrName}'
        GROUP BY _id
        `
      const { data: { result } } = await MAIN_AXIOS.sql(sql)
      const [, value] = result
      if (value && value.length) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(`已存在的属性名称：${attrName}`)
      } else {
        resolve(true)
      }
    })
  }

  static async uniquenessAttrList (modelName) {
    const { SCHEMA } = this
    const sql = `
    SELECT
      jsonb_agg(elements.value) AS attributes
    FROM
        ${SCHEMA},
        jsonb_array_elements(attributes) AS elements
    WHERE 
      name = '${modelName}'
    AND
      elements.value ->> 'uniqueness' = 'true'
        `
    const { data: { result } } = await MAIN_AXIOS.sql(sql)
    const [, attrList] = result
    if (attrList && attrList !== ['NULL']) {
      try {
        // eslint-disable-next-line no-eval
        return eval(attrList[0])
      } catch {
        return []
      }
    } else {
      return []
    }
  }

  static async addAttr (attr = {}, where = {}) {
    if (_.isEmpty(where)) {
      throw new Error('更新参数不允许传入空对象，这会导致更新所有数据')
    }
    const { name: attrName } = attr
    const { name: modelName } = where
    await this._validateAttrName(modelName, attrName)
    const hasuraORM = this._createHasuraORM()
    return hasuraORM.append({ attributes: attr }).where(where)
  }

  static async updateAttr (modelName, attr = {}) {
    const { name: attrName } = attr
    const { SCHEMA } = this
    const sql = `
      UPDATE 
        ${SCHEMA} t1 
      SET 
        attributes = jsonb_set (
          attributes,
          
          ARRAY [ (
            SELECT 
              ORDINALITY::INT - 1 
            FROM
              ${SCHEMA} t2,
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
    return MAIN_AXIOS.sql(sql)
  }
}

export {
  ModelDao
}
