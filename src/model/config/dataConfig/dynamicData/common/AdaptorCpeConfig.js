import { SdwanSiteService } from '@/api'
import { MVSiteService } from '@/api/service/SdwanSiteService'

export default class AdaptorCpeConfig {
  constructor ({
    // 筛选site区域名称
    siteId = '',
    type = '',
    cache = '',
    apiType = 'sdwan'
  }) {
    this.siteId = siteId
    this.type = type
    this.cache = cache
    this.apiType = apiType
  }

  getOption () {
    return { ...this }
  }

  get isAvailable () {
    // TODO:复用暂时让预览都可用
    // return !!this.siteId && !!this.type || this.cache
    return true
  }

  fetch () {
    const { apiType } = this.getOption()
    // TODO:从缓存中读取时忽略siteId值
    switch (apiType) {
      case 'sdwan':
        return this.fetchSDWan()
      case 'mv':
        return this.fetchMV()
    }
  }
  fetchSDWan () {
    const { siteId, type, cache } = this.getOption()
    // TODO:从缓存中读取时忽略siteId值
    if (cache.length) {}
    return SdwanSiteService.getCpuTraffic({ siteId: siteId, type: type })
    // return SdwanSiteService.getAlert()
  }
  fetchMV () {
    const { siteId, type, cache } = this.getOption()
    // TODO:从缓存中读取时忽略siteId值
    if (cache.length) {}
    return MVSiteService.getCpuTraffic({ siteId: siteId, type: type })
    // return SdwanSiteService.getAlert()
  }
}
