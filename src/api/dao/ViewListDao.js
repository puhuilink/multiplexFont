import { ViewDao } from './ViewDao'

class ViewListDao extends ViewDao {
  static async find ({ where = {}, orderBy = { createdate: 'desc' }, ...argus }) {
    return super.find({
      orderBy,
      ...argus,
      where: {
        ...where
      }
    })
  }

  static async add ({ ...view }) {
    const { view_title, view_name, ...argus } = view
    await this._uniqueValidate(view)
    return super.add({
      ...argus,
      'view_title': view_title,
      'view_name': view_name || view_title,
      'protect_level': '1'
    })
  }

  static async update ({ ...view }, { ...where }) {
    const view_id = where.view_id || where.view_id._eq
    await this._uniqueValidate({ ...view, view_id }, false)
    return super.update(view, where)
  }
}

export {
  ViewListDao
}
