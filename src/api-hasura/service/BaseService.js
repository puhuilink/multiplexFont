import _ from 'lodash'
import { batchQuery } from '../utils/hasura-orm'

class BaseService {
  static async uniqueValidate (keys = [], obj = {}, Dao) {
    const queryList = _.flow(
      // 挑选出要校验的值
      () => _.pick(obj, keys),
      // 过滤空值
      val => _.pickBy(val, v => !_.isEmpty(v)),
      // 对象转二维数组
      val => _.entries(val),
      // 拼接查询条件
      val => val.map(([key, value]) => Dao.find({ where: { [key]: { _eq: value } } }).alias(key).select(key))
    )()

    const { data } = await batchQuery(...queryList)

    const errList = _.flow(
      // 对象转二维数组
      () => _.entries(data),
      // 挑选出已存在的数据
      val => val.filter(([key, value]) => !_.isEmpty(value)),
      // 输出报错信息
      val => val.map(([key]) => `已存在的${Dao.fieldsMapping.get(key)}：${obj[key]}`)
    )()

    if (_.isEmpty(errList)) {
      return true
    } else {
      throw new Error(errList.join('\n'))
    }
  }
}

export {
  BaseService
}
