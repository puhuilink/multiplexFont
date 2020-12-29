import { BaseService } from './BaseService'
import { AuthorizeObjectDao, ViewListDao, ViewDesktopDao } from '../dao/index'
import { mutate, query } from '../utils/hasura-orm/index'
import { OBJECT_TYPE } from '@/tables/authorize_object/enum'
import { axios } from '@/utils/request'
import { VIEW_TYPE } from '@/tables/view/enum'

class ViewListService extends BaseService {
  /**
   * 新增视图(标题)
   */
  static async add (argus = {}) {
    await mutate(
      ViewListDao.add(argus)
    )
  }

  /**
   * 编辑视图(标题)
   */
  static async update (view = {}, where = {}) {
    await mutate(
      ViewListDao.update(view, where),
      // 实例视图转模板视图时，删除之前分配出的权限
      ...view.view_type === VIEW_TYPE.template && where.view_id ? [
      // 删除视图分配到的权限
        AuthorizeObjectDao.batchDelete({ object_id: { _eq: where.view_id } }),
        // 删除视图分配到的桌面
        ViewDesktopDao.batchDelete(({ view_id: { _eq: where.view_id } }))
      ] : []
    )
  }

  static async find (argus = {}) {
    return query(
      ViewListDao.find(argus)
    )
  }

  static async batchDelete (idList = []) {
    await mutate(
      // 删除视图
      ViewListDao.batchDelete({ view_id: { _in: idList } }),
      // 删除视图分配到的权限
      AuthorizeObjectDao.batchDelete({ object_id: { _in: idList.map(id => `${id}`) }, object_type: { _eq: OBJECT_TYPE.view } }),
      // 删除视图分配到的桌面
      ViewDesktopDao.batchDelete(({ view_id: { _in: idList } }))
    )
  }

  static async copy (viewId) {
    return axios.get(`/view/copy?viewId=${viewId}`)
  }

  /**
   * 生成视图缩略图
   * @param {File} file
   * @param {String | Number} id 视图id
   */
  static async updateViewThumbnail (file, id) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('id', `${id}`)
    return axios.post('/view/edit', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  }
}

export {
  ViewListService
}
