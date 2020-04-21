import { ViewModel } from './View.model'

export class ViewDesignDao extends ViewModel {
  async find ({ where, ...options }) {
    const { data } = await super.find({
      orderBy: { view_id: 'desc' },
      fields: ['view_id'],
      where: {
        ...where,
        view_type: {
          _eq: 'h5'
        }
      },
      ...options
    })
      .await()
    return data
  }
}
