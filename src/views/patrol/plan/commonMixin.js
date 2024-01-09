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
    async fetchPathListList (value, plan = '') {
      try {
        this.patrolGroupLoading = true
        const { data } = await xungeng.get('/path/listUnBind', {
          params: {
            groupId: value.toString(),
            ...(plan.length > 0 ? { planId: plan.toString() } : {})
          }
        })
        this.pathList = data.map(el => ({ label: el.alias, value: el.id }))
      } catch (e) {
        this.pathList = []
        this.plan.pathId = ''
        throw e
      } finally {
        this.patrolGroupLoading = false
      }
    }
  }
}
