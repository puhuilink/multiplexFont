/* eslint-disable no-unused-vars */
import { UserModel } from './User.model'
import { ViewDesktopModel } from './ViewDesktop.model'
import { log, label } from '../decorator/log.decorator'

export class UserProxyModel {
  add () {

  }

  @log
  @label('删除用户')
  delete () {
    console.log('1')
  }
}
