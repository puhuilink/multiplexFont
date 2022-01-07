import { SdwanSiteService } from '@/api'

class AdaptorStaticSiteConfig {
  constructor ({
    // 筛选site区域名称
    siteId = '',
    type = '',
    status = [],
    isCache = false,
    cache = ''
  }) {
    this.siteId = siteId
    this.type = type
    this.cache = cache
    this.status = status
    this.isCache = isCache
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
    const { siteId, type, isCache, cache } = this.getOption()
    // TODO:从缓存中读取时忽略siteId值
    if (isCache && cache.length > 0) {
      return SdwanSiteService.getWanTraffic({ siteId: cache, type: type })
    }
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

  // 更新文本健康度数据
  fetchText () {
    const { siteId, status } = this.getOption()
    return SdwanSiteService.getSiteStatus({ siteId: siteId, status: status })
  }
}

export { AdaptorStaticSiteConfig }
