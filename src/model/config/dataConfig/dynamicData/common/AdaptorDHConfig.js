import { ViewDataService } from '@/api/index'

export class AdaptorDHConfig {
  constructor ({
    code = '',
    refreshTime = 0
  }) {
    this.code = code
    this.refreshTime = refreshTime
  }

  getOption () {
    return {
      ...this
    }
  }

  isAvailable () {
    return !!this.code
  }

  fetch () {
    const { code } = this

    return ViewDataService
      .xmDHMetric({ code })
      .catch(() => '')
  }
}
