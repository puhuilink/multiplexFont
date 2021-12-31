import { SdwanSiteService } from '@/api'

class AdaptorStaticSiteConfig {
  constructor ({
    // 筛选site区域名称
    siteId = '',
    type = '',
    cache = ''
  }) {
    this.siteId = siteId
    this.type = type
    this.cache = cache
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
    const { siteId, type, cache } = this.getOption()
    // TODO:从缓存中读取时忽略siteId值
    if (cache.length) {}
    return SdwanSiteService.getWanTraffic({ siteId: siteId, type: type })
    // return SdwanSiteService.getAlert()
  }
  fetchConnection () {
    const { siteId, type, cache } = this.getOption()
    // TODO:从缓存中读取时忽略siteId值
    if (cache.length) {}
    return SdwanSiteService.getConnection({ siteId: siteId, type: type })
    // return SdwanSiteService.getAlert()
  }

  // 更新柱状图数据
  fetchBar () {
    const { type } = this.getOption()
    return SdwanSiteService.getAlert({ type: type })
  }
}

export { AdaptorStaticSiteConfig }
