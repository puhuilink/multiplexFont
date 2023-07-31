import { BaseService } from './BaseService'
import { axios } from '@/utils/request'

class RoleService extends BaseService {
  // 角色列表
  static async find (name, isOpen, createTimeStart, createTimeEnd, pageNum = 0, pageSize = 10) {
    let base = `/role/list?pageNum=${pageNum}&pageSize=${pageSize}`
    if (name || isOpen || createTimeEnd || createTimeStart) {
      let plus = '&'
      if (name) {
        plus += `name=${name}&`
      }
      if (isOpen !== null && isOpen !== undefined) {
        plus += `isOpen=${isOpen}&`
      }
      if (createTimeStart) {
        plus += `createTimeStart=${createTimeStart}&`
      }
      if (createTimeEnd) {
        plus += `createTimeEnd=${createTimeEnd}&`
      }
      plus = plus.substring(0, plus.length - 1)
      base += plus
    }
    try {
      const { code, data } =
        await axios.get(base)
      if (code === 200) {
        return data
      }
    } catch (e) {
      this.$message.error(e)
    }
  }
  static async getUser (orgId) {
    const base = 'user/listUnRoleUser'
    try {
      const { code, data } =
        await axios.get(base, { params: { orgId } })
      if (code === 200) {
        return data
      }
    } catch (e) {
      this.$message.error(e)
    }
  }
  static async getBindUser (roleId, orgId) {
    const base = '/user/listUnRoleUser'
    try {
      const { code, data } =
        await axios.get(base, { params: { roleId, orgId } })
      if (code === 200) {
        return data
      }
    } catch (e) {
      this.$message.error(e)
    }
  }
  // 分配用户给角色
  static async assignment (roleCode, userIds = []) {
    try {
      const { code, data } =
        await axios.post('/role/addUsers',
          { 'roleId': roleCode, 'userIds': userIds, opType: 'UNIQUE' })
      if (code === 200) {
        return data
      }
    } catch (e) {
      this.$message.error(e)
    }
  }
  // 分配用户给角色
  static async switchStatus (roleCode, isOpen = true) {
    try {
      const { code, data } =
        await axios.get(`/role/switch?id=${roleCode}&isOpen=${isOpen}`)
      if (code === 200) {
        return data
      }
    } catch (e) {
      this.$message.error(e)
    }
  }
  // 分配用户给角色
  static async deleteRole (roleCode, isOpen = true) {
    try {
      const { code, data } =
        await axios.delete(`/role/${roleCode}`)
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
  RoleService
}
