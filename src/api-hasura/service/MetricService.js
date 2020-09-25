/* eslint-disable no-unused-vars */
import { BaseService } from './BaseService'
import { CmdbHostEndpointMetricService } from './CmdbHostEndpointMetricService'
import { query } from '../utils/hasura-orm/index'
import { MetricDao } from '../dao'
import _ from 'lodash'
import { generateQuery } from '@/utils/graphql'
import { axios, imp } from '@/utils/request'
import message from 'ant-design-vue/es/message'

class MetricService extends BaseService {
  static async find ({ orderBy = { collect_time: 'desc' }, ...argus }) {
    const res = await query(
      MetricDao.find({
        orderBy,
        ...argus
      })
    )
    return res
  }
}

export {
  MetricService
}
