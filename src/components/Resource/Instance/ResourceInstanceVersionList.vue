
<script>
import { InstanceHistoryService } from '@/api-hasura'
import VersionList from '../Common/VersionList'
import { generateQuery } from '@/utils/graphql'

export default {
  name: 'ResourceInstanceVersionList',
  mixins: [VersionList],
  computed: {
    columns: {
      get () {
        return [
          {
            title: '编号',
            dataIndex: '_id',
            sorter: true,
            width: 300
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: true,
            width: 300
          },
          {
            title: '版本',
            dataIndex: 'version',
            sorter: true,
            width: 100
          },
          {
            title: '名称',
            dataIndex: 'label',
            sorter: true,
            width: 300
          }
        ]
      }
    }
  },
  methods: {
    /**
     * 加载表格数据
     * @param {Object} parameter CTable 回传的分页与排序条件
     * @return {Function: <Promise<Any>>}
     */
    loadData (parameter) {
      return InstanceHistoryService.find({
        ...parameter,
        where: {
          ...generateQuery(this.queryParams),
          ...this.where
        },
        fields: this.columns.map(column => column.dataIndex),
        alias: 'data'
      }).then(r => r.data)
    }
  }
}
</script>

<style lang="less">

</style>
,
