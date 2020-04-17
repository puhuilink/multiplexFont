/* eslint-disable no-unused-vars */
import { BaseModel } from './Base.model'
import { alert } from '@/utils/clientConfig'
import HasuraORM from '../utils/hasura-orm'

export class UserModel extends BaseModel {
  constructor (options = {}) {
    super(options)
    this.schema = 't_user'
    this.hasuraORM = new HasuraORM(this.schema, alert)
  }

  find (options) {
    return super.find({
      orderBy: { user_id: 'desc' },
      fields: ['user_id'],
      ...options
    })
  }
}
