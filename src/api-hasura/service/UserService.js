/* eslint-disable no-unused-vars */
import { BaseService } from './BaseService'
import {
  LogDecorator
} from '../decorator'
import {
  AuthorizeObjectUserDao,
  UserDao,
  ViewDesktopDao
} from '../dao'
import { batchQuery, batchMutate } from '../utils/hasura-orm'

const {
  log, label
} = LogDecorator

export class UserService extends BaseService {
  @log
  @label('删除用户')
  static async batchDelete (userIdList) {
    // console.dir(AuthorizeObjectUserDao.batchDelete())
  }

  static async find () {
    const combineQuery = await batchQuery(
      // viewModel.findOne().select(['view_id', 'view_title']),
      UserDao.find({ fields: ['user_id', 'staff_name'] })
    )
    console.log(combineQuery)
  }
}
