import { SdwanSiteService } from '@/api'

export default class AdaptorCpeStatusConfig {
  constructor ({
    // 筛选site区域名称
    siteId = '',
    status = '',
    cache = ''
  }) {
    this.siteId = siteId
    this.status = status
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
    const { siteId, status } = this.getOption()
    return SdwanSiteService.getSiteStatus({ siteId: siteId, status: status })
    // return SdwanSiteService.getAlert()
  }
}
