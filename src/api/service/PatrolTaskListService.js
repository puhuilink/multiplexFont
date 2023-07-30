import { BaseService } from '@/api/service/BaseService'
import { PatrolTaskListDao } from '../dao/index'
import { query } from '@/api/utils/hasura-orm'
import { axios, xungeng } from '@/utils/request'
class PatrolTaskListService extends BaseService {
  // 巡更记录单和审批查询
  static async find (argus = {}) {
    return query(
      PatrolTaskListDao.find(argus)
    )
  }
  // 查询任务单列表
  static async getTaskList (args = {}) {
    const baseUrl = '/taskStatus/list'
    try {
      const { code, data } =
        await xungeng.get(baseUrl, { params: { ...args } })
      if (code === 200) {
        return data
      }
    } catch (e) {
      this.$message.error(e)
    }
  }
  static async getGroupList (args = {}) {
    const baseUrl = '/group/list'
    try {
      const { code, data } =
        await xungeng.get(baseUrl, { params: { ...args } })
      if (code === 200) {
        return data
      }
    } catch (e) {
      this.$message.error(e)
    }
  }
}

export { PatrolTaskListService }
