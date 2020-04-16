/* eslint-disable camelcase */
import { BaseModel } from './Base.model'
import { HasuraFactory } from '../utils//hasuraFactory'
import { alert } from '@/utils/clientConfig'
import _ from 'lodash'

export class ViewModel extends BaseModel {
  constructor (options = {}) {
    super(options)
    this.table = 't_view'
    this.hasura = HasuraFactory.create(alert)
  }

  async find (options) {
    const { data } = await super.find({
      orderBy: { view_id: 'desc' },
      fields: ['view_id'],
      ...options
    })
      .await()
    return data
  }

  async findOne (options) {
    const { data } = await this.find(options)
    return _.first(data)
  }
}
