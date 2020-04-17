/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { BaseModel } from './Base.model'
import { alert } from '@/utils/clientConfig'
import _ from 'lodash'
import HasuraORM from '../utils/hasura-orm'

export class ViewModel extends BaseModel {
  constructor (options = {}) {
    super(options)
    this.schema = 't_view'
    this.hasuraORM = new HasuraORM(this.schema, alert)
  }

  find (options = {}) {
    // const { data } = await super.find({
    //   orderBy: { view_id: 'desc' },
    //   fields: ['view_id'],
    //   ...options
    // })
    //   .await()
    // return data
    return super.find({
      orderBy: { view_id: 'desc' },
      fields: ['view_id'],
      ...options
    })
  }

  findOne (options) {
    // const { data } = await this.find(options)
    // return _.first(data)
    console.log(
      this.find(options)
    )
    return this.find(options).paginate(1, 0)
  }
}
