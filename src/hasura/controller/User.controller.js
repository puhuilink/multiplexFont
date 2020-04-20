/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import { UserModel, ViewModel, ViewDesktopModel, UserProxyModel } from '../model'
import { batchQuery, batchMutate } from '../utils/hasura-orm'
import { log } from '../decorator/log.decorator'

export class UserController {
  async add () {
    const userModel = new UserModel({})
    const viewModel = new ViewModel({})

    const fields = [
      'staff_name',
      `userGroup {
        group {
          group_name
        }
      }`
    ]

    const combineQuery = await batchQuery(
      // viewModel.findOne().select(['view_id', 'view_title']),
      userModel.findOne().select(['user_id', 'staff_name'])
    )
    console.log(combineQuery)
    // return
    // // console.log(user)

    // return console.dir(userModel.hasura.delete)
    return

    // const hasura = view.compose(user)
    // const query = hasura.parsed()

    const hasura = userModel
      // .findOne({
      //   fields
      // })
      .findOne()
      .select(fields)
      // .with('userGroup', query => query.select('group: { group_name }'))
      // const query = hasura.query()
    const query = hasura.compose('t_view', query => query.select(['view_id', 'view_name']))
    console.log(query)
    const res = await hasura.await()
    console.log(res)
  }

  /**
   * 批量删除用户
   * @param {Array<String>} userIdList 用户 id 数组
   * @return {Promise<any>}
   */
  async batchDelete (userIdList = []) {
    const userProxy = new UserProxyModel()
    userProxy.delete(['thx'])
    return
    // user 表删除
    const userModel = new UserModel({})
    // userModel.delete({
    //   user_id: {
    //     _in: userIdList
    //   }
    // })
    // 关联表删除
    // 权限删除
    // 桌面删除
    const viewDesktopModel = new ViewDesktopModel({})
    // viewDesktopModel.delete({
    //   view_name: {
    //     _in: userIdList
    //   },
    //   view_title: {
    //     _eq: '自定义'
    //   }
    // })
    // 批量执行
    await batchMutate(
      userModel.delete({
        user_id: {
          _in: userIdList
        }
      }),
      viewDesktopModel.delete({
        view_name: {
          _in: userIdList
        },
        view_title: {
          _eq: '自定义'
        }
      })
    )
  }
}
