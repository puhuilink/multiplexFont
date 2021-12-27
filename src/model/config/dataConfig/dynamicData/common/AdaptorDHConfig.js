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

  get isAvailable () {
    return !!this.code
  }

  fetch () {
    console.log('DHgetoption', this.getOption())
    const { code } = this
    return ViewDataService
      .xmDHMetric({ code })
      .catch(() => '')
  }
}
