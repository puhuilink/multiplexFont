import { GroupService } from '@/api'
import { xungeng, axios } from '@/utils/request'

export default {
  data: () => ({
    patrolGroupLoading: false,
    pathListLoading: false,
    patrolGroupList: [],
    pathList: []
  }),
  methods: {
    // async fetchPatrolGroupList () {
    //   console.log('执行于此-123456789');
    //   try {
    //     this.patrolGroupLoading = true
    //     const { data: { list } } = await xungeng.get('/group/list', {
    //       params: {
    //         pageNum: 1,
    //         pageSize: 999
    //       }
    //     })
    //     this.patrolGroupList = list.map(el => ({ label: el.name, value: el.id }))
    //   } catch (e) {
    //     this.patrolGroupList = []
    //     throw e
    //   } finally {
    //     this.patrolGroupLoading = false
    //   }
    // },
    async fetchPatrolGroupList () {
      const pageNum = 1
      const pageSize = 9999
      const { data } = await axios.get('/group/list', { params: { pageNum: pageNum, pageSize: pageSize } })
      this.dataList = data.list
      // 请选择工作组赋选择项
      for (const item of data.business) {
        if (item.patrol === true) {
          for (const i of data.list) {
            if (item.groupId === i.id) {
              this.patrolGroupList.push(i)
            }
          }
        }
      }
    },
    async fetchPathListList (value) {
      try {
        const pageNum = 1
        const pageSize = 9999
        this.patrolGroupLoading = true
        const { data } = await xungeng.get('/path/list', {
          params: {
            pageNum: pageNum,
            pageSize: pageSize,
            groupId: value.toString()
          }
        })
        console.log('data', data)
        this.pathList = data.list.map(el => ({ label: el.alias, value: el.id }))
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
