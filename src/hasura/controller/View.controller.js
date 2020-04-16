import { ViewModel } from '../model/View.model'

export class ViewController {
  add () {
    const viewModel = new ViewModel({})
    viewModel.find({
      where: {
        view_type: {
          _eq: 'h5'
        }
      },
      limit: 10,
      offset: 0,
      fields: [
        'view_id',
        'view_name',
        'view_title'
      ]
    })
    viewModel.findOne({
      where: {
        view_id: {
          _eq: 1
        }
      }
    })
  }
}
