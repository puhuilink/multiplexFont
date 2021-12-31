import { SdwanSiteService } from '@/api'

class AdaptorOrmConfig {
  constructor ({
    // 筛选site区域名称
    name = '',
    code = '',
    cache = ''
  }) {
    this.name = name
    this.code = code
    this.cache = cache
  }

  getOption () {
    return { ...this }
  }

  get isAvailable () {
    return !!this.name || !!this.cache
  }

  fetch () {
    const { name, cache } = this.getOption()
    const where = {}
    if (cache.length) {
      where.id = { _eq: cache }
    } else {
      where.name = { _eq: name }
    }
    return SdwanSiteService.find({
      where: {
        ...where
      },
      fields: [
        'originName: name',
        'originLat: lat',
        'originLng: lng',
        'peerNode: connectionName { peerName { lat, lng, name } }'
      ],
      alias: 'connection'
    }).then(({ data }) => data || [])
  }
}

export { AdaptorOrmConfig }
