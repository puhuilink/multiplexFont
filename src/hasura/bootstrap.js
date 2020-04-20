/* eslint-disable no-unused-vars */

import {
  ViewController,
  UserController
} from './controller'

export default function boostrap () {
  setTimeout(() => {
    // const viewController = new ViewController()
    // viewController.add()
    const userController = new UserController()
    // userController.add()
    userController.batchDelete()
    // FIXME: vuex 挂载需要时间
  }, 1000)
}
