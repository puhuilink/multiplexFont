/* eslint-disable camelcase */
import { BaseModel } from './Base.model'
import { HasuraFactory } from '../utils//hasuraFactory'
// export const VIEW_MODEL_SCHEMA = new Map
import { alert } from '@/utils/clientConfig'

export class ViewModel extends BaseModel {
  constructor (options = {}) {
    super(options)
    this.table = 't_view'
    this.hasura = HasuraFactory.create(alert)
  }

  add () {
    const query = this.hasura('products')
      .where({ 'id': 1, 'product_locales': { 'name': { '_ilike': 'test' } } })
      .with('product_locales', query => {
        return query.select(['name', 'age'].join(',')).where({ 'locales_id': 1 })
      })
      .compose('address', query => {
        return query
          .select('name')
          .where({ 'id': { '_gte': 1 } })
          .paginate(5, 0)
      })
      .where({
        _or: { article: { _eq: '1' }, _and: [{ article: { _eq: '2' }, rest: { _gt: 2 } }] }
      })
      .orderBy({ rest: 'asc' })
      .distinct('rest')
      .paginate(5, 0)
      .paginate(5, 0)
      .query()

    console.log(query)
  }

  find (options = {}) {
    const query = this.allList(options)
    console.log(query)
  }

  async findWithPagination (options) {
    // const query = await this.listWithPagination(options).await(false)
    const query = await this.listWithPagination({
      orderBy: { view_id: 'desc' },
      fields: ['view_id'],
      ...options
    }).await(false)
    console.log(query)
  }

  findOne () {

  }
}
