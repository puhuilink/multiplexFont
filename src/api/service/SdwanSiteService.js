import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { SdwanSiteDao } from '../dao/index'
import { axios, sql } from '@/utils/request'
import { sqlResultDealer } from '@/utils/util'
import _ from 'lodash'

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

  static async getCommon (param = {}) {
    const { addr, ...rest } = param
    return axios.post(`${addr}`, { ...rest })
  }

  // 显示site站点所关联的cpe站点状态
  static async getSiteStatus (param = {}) {
    const { siteId, status } = param
    const q = `select count(1) from t_sdwan_cpe where site_id in
    (select peer_site_id from t_sdwan_connection where site_id = '${siteId}')
    and status in (${status.map(el => '\'' + el + '\'').join()});`
    const res = await sql(q)
    return _.get(sqlResultDealer(res), '0.count', '暂无数据')
  }
}
export {
  SdwanSiteService
}
