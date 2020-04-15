import { ViewModel } from '../model/View.model'

export class ViewController {
  add () {
    const viewModel = new ViewModel({})
    viewModel.add()
  }
}
