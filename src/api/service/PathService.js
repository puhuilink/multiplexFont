import { BaseService } from './BaseService'
import { axios, xungeng } from '@/utils/request'

class PathService extends BaseService {
  // 路线列表
  static async find (alias, pageNum = 0, pageSize = 10, groupId) {
    let base = `/path/list?pageNum=${pageNum}&pageSize=${pageSize}`
    if (alias) {
      alias = encodeURIComponent(alias)
      base += `&alias=${alias}`
    }
    if (groupId) {
      groupId = encodeURIComponent(groupId)
      base += `&alias=${groupId}`
    }
    try {
      const { code, data } =
        await xungeng.get(base)
      if (code === 200) {
        return data
      }
    } catch (e) {
      this.$message.error(e)
    }
  }
  // 导入路线
  static async importPath (form) {
    try {
      const formD = new FormData()
      formD.append('pathId', form.pathId)
      formD.append('file', form.file)
      const { code, data } =
        await xungeng.post('/path/updateAllPath',
          formD, { header: { 'content-type': 'application/x-www-form-urlencoded' } })
      if (code === 200) {
        return data
      }
    } catch (e) {
      this.$message.error(e)
    }
  }

  // 添加路线
  static async add (form) {
    try {
      const formD = new FormData()
      formD.append('alias', form.alias)
      formD.append('file', form.file)
      formD.append('ascription', form.ascription)
      formD.append('groupId', form.groupId)
      const { code, data } =
        await axios.post('/path/add',
          formD, { header: { 'content-type': 'multipart/form-data' } })
      if (code === 200) {
        return data
      }
    } catch (e) {
      this.$message.error(e)
    }
  }
  // 分配用户给角色
  static async getPathList (pathId) {
    try {
      const pageNum = 0
      const pageSize = 9999
      const { code, data } =
        await xungeng.get(`/path/find?pathId=${pathId}&pageNum=${pageNum}&pageSize=${pageSize}`)
      if (code === 200) {
        return data
      }
    } catch (e) {
      this.$message.error(e)
    }
  }
  // 分配用户给角色
  static async updatePath (arg) {
    try {
      const { id, ...other } = arg
      const args = {}
      Object.assign(args, { pathId: id }, other)
      const formData = new FormData()
      Object.keys(args).forEach(key => formData.append(key, args[key]))
      const { code, data } = await axios.post(`/path/update`, formData)
      if (code === 200) {
        return data
      }
    } catch (e) {
      this.$message.error(e)
    }
  }
  // 分配用户给角色
  static async deletePath (pathId) {
    try {
      const { code, data } =
        await xungeng.delete(`/path/${pathId}`)
      if (code === 200) {
        return data
      }
    } catch (e) {
      this.$message.error(e)
    }
  }
  // 更新角色信息
  static async update (record) {
    try {
      const { code, data } =
        await axios.post('/role/save',
          { ...record })
      if (code !== 200) {
        throw Error(data)
      }
    } catch (e) {
      this.$message.error(e)
    }
  }
}

export {
  PathService
}
