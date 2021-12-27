import { AdaptorConfig } from '@/model/config/dataConfig/dynamicData/common/AdaptorConfig'
import { SdwanSiteService } from '@/api'
import _ from 'lodash'

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
    return !!this.name
  }

  fetch () {
    console.log('first1', this.name, this.cache)
    const { name, code, cache } = this.getOption()
    const where = {}
    if (cache.length) {
      where.id = { _eq: cache }
    } else {
      where.name = { _eq: name }
    }
    console.log('first', name, cache, where)
    // console.log('fetch', )
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
