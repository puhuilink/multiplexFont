import { Subject } from 'rxjs'

export default class AutoAlignService {
  constructor () {
    if (!AutoAlignService.prototype.instance) {
      this.change = new Subject()
      this.change$ = this.change.asObservable()
      AutoAlignService.prototype.instance = this
    }
    return AutoAlignService.prototype.instance
  }

  next (event) {
    this.change.next(event)
  }
}
