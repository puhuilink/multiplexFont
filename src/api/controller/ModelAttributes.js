import apollo from '@/utils/apollo'
import { queryModelAttributeList } from '../graphql/ModelAttributes'

/**
 * 资源模型属性列表
 * @param {Object} variables 查询条件
 * @return {Promise<any>}
 */
export const getModelAttributeList = function (variables) {
  return apollo.clients.resource.query({
    query: queryModelAttributeList,
    variables
  })
}
