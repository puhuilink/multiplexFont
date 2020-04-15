/* eslint-disable camelcase */
import hasura from '../hasura'

export class ViewModel {
  static schema = 't_view'
  // constructor ({
  //   view_id,
  //   view_name,
  //   view_title,
  //   view_type,
  //   protect_level,
  //   content,
  //   creator,
  //   createdate,
  //   updator,
  //   updatedate,
  //   view_img
  // }) {
  //   this.view_id = view_id
  //   this.view_name = view_name
  //   this.view_title = view_title
  //   this.view_type = view_type
  //   this.protect_level = protect_level
  //   this.content = content
  //   this.creator = creator
  //   this.createdate = createdate
  //   this.updator = updator
  //   this.updatedate = updatedate
  //   this.view_img = view_img
  // }
  add () {
    const query = hasura('products')
      .where({ 'id': 1, 'product_locales': { 'name': { '_ilike': 'test' } } })
      .with('product_locales', query => {
        return query.select('name').where({ 'locales_id': 1 })
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
}
