/**
 * 巡更配置服务：设备管理
 */

import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import {
  PatrolPathDao,
  PatrolEndpointDao, PatrolMetricDao, PatrolHostDao, PatrolAnswerDao, PatrolCheckpointDao
} from '../dao/index'
import _ from 'lodash'

class PatrolConfigService extends BaseService {
  static async checkpointsFind (argus = {}) {
    return query(
      PatrolPathDao.find(argus)
    )
  }

  static async _aliasMapping (checkpoints = []) {
    let checkpointIdList = []
    let hostIdList = []
    let endpointIdList = []
    let metricIdList = []
    let answerIdList = []

    // 扁平化所有节点 id
    checkpoints.forEach(({ checkpointId, hosts = [] }) => {
      checkpointIdList.push(checkpointId)

      hosts.forEach(({ hostId, endpoints = [] }) => {
        hostIdList.push(hostId)

        endpoints.forEach(({ endpointId, metrics = [] }) => {
          endpointIdList.push(endpointId)

          metrics.forEach(({ answerId, metricId }) => {
            answerIdList.push(answerId)
            metricIdList.push(metricId)
          })
        })
      })
    })

    // 去重查询
    checkpointIdList = _.uniq(checkpointIdList)
    hostIdList = _.uniq(hostIdList)
    endpointIdList = _.uniq(endpointIdList)
    metricIdList = _.uniq(metricIdList)
    answerIdList = _.uniq(answerIdList)
    console.log(
      // checkpointIdList,
      // hostIdList,
      // endpointIdList,
      // metricIdList,
      answerIdList
    )

    const buildArgus = (_in, alias) => ({
      where: { id: { _in } },
      alias,
      fields: ['id', 'alias']
    })

    // FIXME: 数据库数据不匹配，查询出内容为空
    const { data } = await query(
      PatrolCheckpointDao.find(buildArgus(checkpointIdList, 'checkpointMapping')),
      PatrolHostDao.find(buildArgus(hostIdList, 'hostMapping')),
      PatrolEndpointDao.find(buildArgus(endpointIdList, 'endpointMapping')),
      PatrolMetricDao.find(buildArgus(metricIdList, 'metricMapping')),
      PatrolAnswerDao.find(buildArgus(answerIdList, 'answerMapping'))
    )
    console.log(data)
  }

  static async dataSource () {
    const { data: { pathList } } = await query(
      PatrolPathDao.find({
        where: {
          group_id: 'patrolgroup-xmenv',
          status: 'enabled'
        },
        fields: ['id', 'alias', 'content'],
        alias: 'pathList'
      })
    )

    if (_.isEmpty(pathList)) {
      return
    }

    // console.log(pathList)
    const { content = [] } = _.first(pathList)
    // 第一层
    const { checkpoints } = _.first(content)
    console.log(checkpoints)
    this._aliasMapping(checkpoints)
    // return checkpoints
    // 递归构造 alias
  }
}

export {
  PatrolConfigService
}
