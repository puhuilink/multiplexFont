
import { axios } from '@/utils/request'

class AdaptorOpenConfig {
  constructor ({
    // 筛选site区域名称
    address = '',
    args = '',
    back = ''
  }) {
    this.address = address
    this.args = args
    this.back = back
  }

  getOption () {
    return { ...this }
  }

  get isAvailable () {
    return !!this.address
  }

  fetch () {
    const { address, args } = this.getOption()
    let obj
    try {
      obj = JSON.parse(args)
    } catch (e) {
      obj = {}
    }
    return axios.post(address, obj, {
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then(({ data }) => data || [])
  }
}

export { AdaptorOpenConfig }
