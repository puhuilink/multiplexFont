import { GroupService } from '@/api'
import { xungeng } from '@/utils/request'

export default {
  data: () => ({
    patrolGroupLoading: false,
    pathListLoading: false,
    patrolGroupList: [],
    pathList: []
  }),
  methods: {
    async fetchPatrolGroupList () {
      try {
        this.patrolGroupLoading = true
        const { data: { list } } = await xungeng.get('/group/list', {
          params: {
            pageNum: 1,
            pageSize: 999
          }
        })
        this.patrolGroupList = list.map(el => ({ label: el.name, value: el.id }))
      } catch (e) {
        this.patrolGroupList = []
        throw e
      } finally {
        this.patrolGroupLoading = false
      }
    },
    async fetchPathListList (value, pathId = '') {
      try {
        this.patrolGroupLoading = true
        const { data: { list } } = await xungeng.get('/path/listUnBind', {
          params: {
            groupId: value,
            ...(pathId.length > 0 ? { pathId: pathId } : {})
          }
        })
        this.pathList = list.map(el => ({ label: el.alias, value: el.id }))
      } catch (e) {
        this.pathList = []
        throw e
      } finally {
        this.patrolGroupLoading = false
      }
    }
  }
}
