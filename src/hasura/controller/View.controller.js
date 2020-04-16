import { ViewModel } from '../model/View.model'

export class ViewController {
  add () {
    const viewModel = new ViewModel({})
    console.log(viewModel)
    // viewModel.findWithPagination()
    viewModel.findWithPagination({
      where: {
        view_type: {
          _eq: 'h5'
        }
      },
      fields: [
        'view_id',
        'view_name',
        'view_title'
      ]
    })
  }
}
