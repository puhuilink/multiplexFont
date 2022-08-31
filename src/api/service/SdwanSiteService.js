import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { SdwanSiteDao, MvSiteInfoDao } from '../dao/index'
import { axios, sql } from '@/utils/request'
import { dealQuery, sqlResultDealer } from '@/utils/util'
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
  }static async getAlertException (param = {}) {
    return axios.post('/sdwan/getAlertException', param)
  }
  static async getAlertTop (param = {}) {
    return axios.post('/sdwan/getAlertTop', param)
  }
  static async getErrorConnection (param = {}) {
    return axios.post('/sdwan/getErrorConnection', param)
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
  static async getPeerSite (id = '') {
    const str = `select DISTINCT(peer_site_id) as id,name from t_sdwan_connection c left join t_sdwan_site s on c.peer_site_id = s.id where c.origin_site_id = '${id}' `
    const res = await sql(str)
    return dealQuery(res)
  }
  static async getCityConnection (id = '5f34d35396b1f125918db25e') {
    const str = `select distinct s.city,vsc.lat,vsc.lng from t_sdwan_connection c left join t_sdwan_site s on c.peer_site_id = s.id  left join v_sdwan_site vsc on s.city = vsc.city where origin_site_id = '${id}'`
    const res = await sql(str)
    return dealQuery(res)
  }
  static async getCityList () {
    const str = `select * from v_sdwan_site`
    const res = await sql(str)
    return dealQuery(res)
  }
  static async getSiteList (city) {
    const str = `select id,name from t_sdwan_site where city = '${city}'`
    const res = await sql(str)
    return dealQuery(res)
  }

  // 显示site站点所关联的cpe站点状态
  static async getSiteStatus (param = {}) {
    const { siteId, status } = param
    const q = `select sum(total) total from (
    select 
    count(1) total
    from t_sdwan_cpe where site_id = '${siteId}'
    and status in (${status.map(el => '\'' + el + '\'').join()})
    union all
    select 
    count(1)  total
    from t_sdwan_cpe where site_id in (
    select peer_site_id from t_sdwan_connection  where origin_site_id = '${siteId}'
    and status in (${status.map(el => '\'' + el + '\'').join()}))
) as table1;`
    const res = await sql(q)
    return _.get(sqlResultDealer(res), '0.total', '暂无数据')
  }
}
class MVSiteService extends BaseService {
  // 地图专用查询
  static async find (argus = {}) {
    return query(
      MvSiteInfoDao.find(argus)
    )
  }
  // 站点传输速率查询
  static async getWanTraffic (param = {}) {
    return axios.post('/mv/getWan', param)
  }

  static async getAlert (param = {}) {
    return axios.post('/mv/getAlarmTop', param)
  }

  // 获取站点的CPU和内存利用率
  static async getCpuTraffic (param = {}) {
    return axios.post('/mv/getSiteTop', param)
  }
  static async getWanDelay (param = {}) {
    return axios.post('/mv/getMonitorLoss', param)
  }static async getNetworkDelay (param = {}) {
    return axios.post('/mv/getSiteLoss', param)
  }
  static async getWanPacket (param = {}) {
    return axios.post('/mv/getPacket', param)
  }
  static async getAllError (param = {}) {
    return axios.post('/mv/getAllConnection', param)
  }
  static async getErrorById (param = {}) {
    return axios.post('/mv/getSiteConnection', param)
  }
  static async getRelationSiteById (param = {}) {
    return axios.post('/mv/getSiteRelation', param)
  }
}
export {
  SdwanSiteService,
  MVSiteService
}
