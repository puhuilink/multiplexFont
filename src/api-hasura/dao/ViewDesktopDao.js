import { ViewDao } from './ViewDao'

export class ViewDesktopDao extends ViewDao {
  delete (argus) {
    return super.delete({
      ...argus,
      view_type: {
        _eq: 'desktop'
      }
    })
  }
}
