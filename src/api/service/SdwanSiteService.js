import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { SdwanSiteDao } from '../dao/index'
import { axios } from '@/utils/request'

class SdwanSiteService extends BaseService {
  // 地图专用查询
  static async find (argus = {}) {
    return query(
      SdwanSiteDao.find(argus)
    )
  }

  // 站点传输速率查询
  static async getWanTraffic (param = {}) {
    return axios.post('/sdwan/getWan', param)
  }

  static async getAlert (param = {}) {
    return axios.post('/sdwan/getAlert', param)
  }

  // 获取站点的CPU和内存利用率
  static async getCpuTraffic (param = {}) {
    return axios.post('/sdwan/getCPE', param)
  }
  static async getConnection (param = {}) {
    return axios.post('/sdwan/getConnection', param)
  }

  static async getCommon (param = {}) {
    const { addr, ...rest } = param
    return axios.post(`${addr}`, { ...rest })
  }
}
export {
  SdwanSiteService
}
