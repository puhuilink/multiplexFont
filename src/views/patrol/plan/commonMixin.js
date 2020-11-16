import { GroupService } from '@/api'

export default {
  data: () => ({
    patrolGroupLoading: false,
    patrolGroupList: []
  }),
  methods: {
    async fetchPatrolGroupList () {
      try {
        this.patrolGroupLoading = true
        const { data: { patrolGroupList } } = await GroupService.patrolFind({
          // TODO: flag?
          where: {},
          fields: ['group_name', 'group_id'],
          alias: 'patrolGroupList'
        })
        this.patrolGroupList = patrolGroupList
      } catch (e) {
        this.patrolGroupList = []
        throw e
      } finally {
        this.patrolGroupLoading = false
      }
    }
  }
}
