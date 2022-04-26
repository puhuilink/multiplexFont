import { SdwanSiteService } from '@/api'
import { MVSiteService as MvSiteService } from '@/api/service/SdwanSiteService'

class AdaptorStaticSiteConfig {
  constructor ({
    // 筛选site区域名称
    siteId = '',
    peerId = '',
    type = '',
    status = [],
    isCache = false,
    apiType = 'sdwan',
    cache = '',
    unit = 'Kbps',
    requestType = 'wan'
  }) {
    this.siteId = siteId
    this.peerId = peerId
    this.type = type
    this.unit = unit
    this.cache = cache
    this.status = status
    this.isCache = isCache
    this.apiType = apiType
    this.requestType = requestType
  }

  getOption () {
    return { ...this }
  }

  get isAvailable () {
    // TODO:复用暂时让预览都可用
    // return !!this.siteId && !!this.type || this.cache
    return true
  }

  api () {
    const { apiType } = this.getOption()
    // TODO:从缓存中读取时忽略siteId值
    switch (apiType) {
      case 'sdwan':
        return SdwanSiteService
      case 'mv':
        return MvSiteService
    }
  }

  requestData () {
    const { requestType } = this.getOption()
    switch (requestType) {
      case 'wan':
        return this.fetch()
      case 'delay':
        return this.fetchDelay()
      case 'netDelay':
        return this.fetchNetworkDelay()
      case 'packet':
        return this.fetchPacket()
      default:
        return this.fetch()
    }
  }

  fetch () {
    const { siteId, type, isCache, cache } = this.getOption()
    if (isCache && cache.length > 0) {
      return this.api().getWanTraffic({ siteId: cache.split(','), type: type })
    }
    return this.api().getWanTraffic({ siteId: siteId.split(','), type: type })
  }
  fetchDelay () {
    const { peerId, type } = this.getOption()
    return this.api().getWanDelay({ monitorId: peerId, type: type })
  }
  fetchNetworkDelay () {
    const { siteId, peerId, type } = this.getOption()
    return this.api().getNetworkDelay({ siteId: siteId, peerSiteId: peerId, type: type })
  }
  fetchPacket () {
    const { siteId, type, isCache, cache } = this.getOption()
    if (isCache && cache.length > 0) {
      return this.api().getWanPacket({ siteId: cache, type: type })
    }
    return this.api().getWanPacket({ siteId: siteId, type: type })
  }
  fetchConnection () {
    const { siteId, type, cache } = this.getOption()
    // TODO:从缓存中读取时忽略siteId值
    if (cache.length) {}
    return this.api().getConnection({ siteId: siteId, type: type })
    // return this.api().getAlert()
  }

  // 更新柱状图数据
  fetchBar () {
    const { type } = this.getOption()
    return this.api().getAlert({ type: type })
  }

  // 更新文本健康度数据
  fetchText () {
    const { siteId, status } = this.getOption()
    return this.api().getSiteStatus({ siteId: siteId, status: status })
  }
}

export { AdaptorStaticSiteConfig }
