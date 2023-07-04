import { BaseService } from './BaseService'
import { mutate, query } from '../utils/hasura-orm/index'
import { AuthorizeObjectDao, ViewDao, ViewDesktopDao, UserDao, GroupDao } from '../dao/index'
import { OBJECT_TYPE } from '@/tables/authorize_object/enum'
import _ from 'lodash'
import { axios, xungeng } from '@/utils/request'
import { encrypt } from '@/utils/aes'

class AuthorizeObjectService extends BaseService {
  static async find (argus = {}) {
    return query(
      AuthorizeObjectDao.find(argus)
    )
  }

  /**
   * 获取用户或工作组使用到的视图id
   */
  static async viewIdList ({ user_id, group_id }) {
    const snippet = {
      ...user_id ? { user_id } : { group_id }
    }
    const { data: { authorizeList, list } } = await query(
      // 已分配权限的视图
      AuthorizeObjectDao.find({
        where: { ...snippet, object_type: OBJECT_TYPE.view },
        fields: ['object_id'],
        alias: 'authorizeList'
      }),
      // 已放置到视图桌面的视图
      (user_id ? UserDao : GroupDao).find({
        where: { ...snippet },
        fields: [
          `viewDesktops {
            view {
                view_id
            }
          }`
        ],
        alias: 'list'
      })
    )

    const viewIdList = authorizeList.map(({ object_id }) => object_id)
    if (list.length) {
      const [{ viewDesktops }] = list
      viewDesktops.forEach((el) => {
        viewIdList.push(el.view.view_id)
      })
    }
    return _.uniq(viewIdList)
  }

  /**
   * 获取用户或工作组分配的视图
   */
  static async viewList ({ user_id, group_id }) {
    const viewIdList = await this.viewIdList({ user_id, group_id })

    if (_.isEmpty(viewIdList)) {
      return []
    }

    const { data: { viewList } } = await query(
      ViewDao.find({
        where: { view_id: { _in: viewIdList } },
        fields: ['view_title', 'view_id'],
        alias: 'viewList'
      })
    )

    return viewList
  }

  static async allocateGroupView (group_id, viewIdList) {
    // 当前已分配的视图id
    const currentViewIdList = await this.viewIdList({ group_id })

    // 权限不变的视图id(求交集)
    const intersectionalViewIdList = _.intersection(currentViewIdList, viewIdList)
    // 权限被删除的视图id
    const abandonViewIdList = _.xorBy(
      currentViewIdList,
      intersectionalViewIdList,
      view_id => !currentViewIdList.includes(view_id)
    )

    await mutate(
      // 删除之前的视图权限
      AuthorizeObjectDao.batchDelete(({ group_id, object_type: OBJECT_TYPE.view })),
      // 全量更新现在的视图权限
      AuthorizeObjectDao.batchAdd(
        viewIdList.map(view_id => ({ group_id, object_id: view_id, object_type: OBJECT_TYPE.view }))
      ),
      // 删除曾经已分配到视图桌面上但现在无权限的视图
      ViewDesktopDao.batchDelete({ group_id, view_id: { _in: abandonViewIdList } })
    )
  }

  static async allocateUserView (user_id, viewIdList) {
    // 当前已分配的视图id
    const currentViewIdList = await this.viewIdList({ user_id })

    // 权限不变的视图id(求交集)
    const intersectionalViewIdList = _.intersection(currentViewIdList, viewIdList)
    // 权限被删除的视图id
    // currentViewIdList长度>=intersectionalViewIdList长度
    // intersectionalViewIdList中不包含的元素即为要删除的元素
    const abandonViewIdList = _.xorBy(
      intersectionalViewIdList,
      currentViewIdList,
      view_id => !intersectionalViewIdList.includes(view_id)
    )

    await mutate(
      // 删除之前的视图权限
      AuthorizeObjectDao.batchDelete(({ user_id, object_type: OBJECT_TYPE.view })),
      // 全量更新现在的视图权限
      AuthorizeObjectDao.batchAdd(
        viewIdList.map(view_id => ({ user_id, object_id: view_id, object_type: OBJECT_TYPE.view }))
      ),
      // 删除曾经已分配到视图桌面上但现在无权限的视图
      ViewDesktopDao.batchDelete({ user_id, view_id: { _in: abandonViewIdList } })
    )
  }

  static async getPatrolRoles (id) {
    const { data } = await xungeng.post('/role/get', { userId: encrypt(id) })
    return _.get(data, 'code', '')
  }

  static async getPatrolRolesList () {
    const { data } = await xungeng.get('/role/list')
    return data.map(el => ({
      label: _.get(el, 'name', ''),
      value: _.get(el, 'code', '') })
    )
  }

  static async savePatrolRoles (param) {
    if (param) {
      return xungeng.post('/role/save', { ...param })
    }
  }

  /**
   * 获取用户权限
   * @param userId
   * @returns {AxiosPromise}
   */
  static async getUserPermission (userId) {
    return axios({
      url: '/function/getUserFunction',
      method: 'get',
      params: {
        userId
      }
    })
  }

  /**
   * 获取用户组权限
   * @param groupId
   * @returns {AxiosPromise}
   */
  static async getGroupPermission (groupId) {
    return axios({
      url: '/function/getGroupFunction',
      method: 'get',
      params: {
        groupId
      }
    })
  }

  /**
   * 修改用户权限
   * @param id
   * @param authorizeObjectList
   * @returns {AxiosPromise}
  */
  static async modifyUserPermission (id, authorizeObjectList) {
    return axios({
      url: '/function/changeUserFunction',
      method: 'post',
      data: {
        id,
        authorizeObjectList
      }
    })
  }

  /**
   * 修改用户权限
   * @param id
   * @param authorizeObjectList
   * @returns {AxiosPromise}
   */
  static async modifyGroupPermission (id, authorizeObjectList) {
    return axios({
      url: '/function/changeGroupFunction',
      method: 'post',
      data: {
        id,
        authorizeObjectList
      }
    })
  }
}

export {
  AuthorizeObjectService
}
