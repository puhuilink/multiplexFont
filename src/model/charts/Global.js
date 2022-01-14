import Chart from '@/model/charts/index'
import { SOURCE_TYPE_ORM, SOURCE_TYPE_STATIC } from '@/model/config/dataConfig/dynamicData/types/sourceType'
import _ from 'lodash'
export default class Global extends Chart {
  constructor ({ widget }) {
    super({ widget })
  }

  async mappingOption ({ commonConfig, proprietaryConfig, dataConfig }, loadingDynamicData = false) {
    const { sourceType } = dataConfig
    const allData = {}
    const node = []
    const moveLine = []
    const citys = []
    switch (sourceType) {
      case SOURCE_TYPE_STATIC: {
        break
      }
      case SOURCE_TYPE_ORM: {
        const { connection } = await dataConfig.dbDataConfig.getOption(loadingDynamicData, sourceType)
        if (connection === 'data') {
          return {}
        }
        const originLat = _.get(connection, ['0', 'originLat'])
        const originLng = _.get(connection, ['0', 'originLng'])
        const originName = _.get(connection, ['0', 'originName'])
        const city = _.get(connection, ['0', 'city'])
        node.push({
          name: originName,
          value: [Number(originLng), Number(originLat), 2],
          symbolSize: 5,
          itemStyle: {
            'normal': {
              'color': '#FFBF31'
            }
          }
        })
        citys.push({
          name: city.split('/')[0],
          value: [Number(originLng), Number(originLat), 2],
          symbolSize: 0.1,
          itemStyle: {
            'normal': {
              'color': '#FFBF31'
            }
          }
        })
        connection.map(el => {
          // let { peer: { originLat, originLng, originName } } = el
          if (el.peerNode) {
            const { peerNode: { peerName: { name, lat, lng, city } } } = el
            node.push({
              name: name,
              value: [Number(lng), Number(lat), 2],
              symbolSize: 4,
              itemStyle: {
                'normal': {
                  'color': '#58B3CC'
                }
              }
            })
            citys.push({
              name: city.split('/')[0],
              value: [Number(lng), Number(lat), 2],
              symbolSize: 0.1,
              itemStyle: {
                'normal': {
                  'color': '#FFBF31'
                }
              }
            })
            moveLine.push({
              fromName: originName,
              toName: name,
              coords: [[Number(originLng), Number(originLat)], [Number(lng), Number(lat)]]
            })
          }
        })
        Object.assign(allData, { 'city': node })
      }
    }
    const option = proprietaryConfig.getOption()
    option.series[0].data = node
    option.series[1].data = citys
    option.series[2].data = moveLine
    return option
  }
}
