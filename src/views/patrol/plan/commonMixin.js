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
          where: { is_patrol: { _eq: true } },
          fields: ['group_name', 'groupId: group_id'],
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
