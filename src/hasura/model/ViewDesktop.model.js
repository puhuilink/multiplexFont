import { ViewModel } from './View.model'

export class ViewDesktopModel extends ViewModel {
  delete (argus) {
    return super.delete({
      ...argus,
      view_type: {
        _eq: 'desktop'
      }
    })
  }
}
