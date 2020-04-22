import _ from 'lodash'

/**
 *
 * @param {String} key 要查询的字段名称
 * @param {Any} value 要查询的字段值
 * @param {Boolean} fuzzy 是否启用模糊查询
 */
const dynamicQueryField = function (key, value, fuzzy = false) {
  const matchSymbol = fuzzy ? '_ilike' : '_eq'
  const val = fuzzy ? `%${String(value).trim()}%` : value

  return val ? {
    [key]: {
      [matchSymbol]: val
    }
  } : {}
}

/**
 * 批量生成查询语句
 * @param {Array<String>} keys 要校验的 key
 * @param {Object} obj 校验的 key 所属的对象
 * @return {Array<Object>}
 */
const multipleMatch = function (keys = [], obj = {}) {
  return _.flow(
    // 挑选出要校验的值
    () => _.pick(obj, keys),
    // 过滤空值
    val => _.pickBy(val, v => !_.isEmpty(v)),
    // 对象转二维数组
    val => _.entries(val),
    // 拼接为 graphql 查询条件
    val => val.map(([key, value]) => ({ [key]: { _eq: value } }))
  )()

  // const keys = ['user_id', 'phone', 'mobile_phone', 'email']
  // // 批量生成查询条件
  // const query = multipleMatch(keys, argus)

  // if (!_.isEmpty(query)) {
  //   const { data: { user } } = await UserDao.find({ where: { _or: query } }).select(keys).alias('user').await()
  //   console.log(user)
  // }
}

export {
  dynamicQueryField,
  multipleMatch
}
