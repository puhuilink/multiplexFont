import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { DictValueDao } from '../dao/index'
import store from '@/store'
import { CacheMutationTypes } from '@/store/modules/cache'

class DictValueService extends BaseService {
  static async find (argus = {}) {
    return query(
      DictValueDao.find(argus)
    )
  }

  static async treeData () {
    const { dictValueTreeData } = store.state['cache']

    if (dictValueTreeData && dictValueTreeData.length) {
      return dictValueTreeData
    }

    const itemOnDictValue = `
      label: value_label
      value: value_code
    `

    const { data: { treeData } } = await DictValueService.find({
      where: { value_param: { _eq: '1' } },
      alias: 'treeData',
      fields: [
        `
        ${itemOnDictValue},
          children {
            ${itemOnDictValue}
            children {
              ${itemOnDictValue}
            }
          }
        `
      ]
    })

    store.commit(CacheMutationTypes.setDictValueTreeData, {
      dictValueTreeData: treeData
    })

    return treeData
  }
}

export {
  DictValueService
}
