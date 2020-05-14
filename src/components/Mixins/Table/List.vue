<script>
import CTable from '@/components/Table/CTable'
import _ from 'lodash'

export default {
  name: 'List',
  components: {
    CTable
  },
  props: {
    where: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    // 查询栏是否展开
    advanced: false,
    // 查询参数
    queryParams: {},
    // 选中行
    selectedRows: [],
    // 选中行的 key
    selectedRowKeys: []
  }),
  computed: {
    scrollX () {
      return _.sum(this.columns.map(e => e.width || 60))
    },
    scrollY () {
      return 'calc(100vh - 290px)'
    },
    scroll () {
      const { scrollX: x = true, scrollY: y = true } = this
      return { x, y }
    }
  },
  methods: {
    /**
     * 查询
     */
    query () {
      this.$refs['table'].refresh(true)
    },
    /**
     * 重置查询条件
     */
    resetQueryParams () {
      Object.assign(this.$data.queryParams, this.$options.data.apply(this).queryParams)
    },
    /**
     * 重置选中行
     */
    resetSelectedRows () {
      this.selectedRows = []
      this.selectedRowKeys = []
    },
    /**
     * 重置组件数据
     */
    reset () {
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    /**
     * 表格行选中
     */
    selectRow (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /**
     * 切换查询栏展开状态
     * @event
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>

<style lang="less">
.fold {
  display: inline-block;
  width: calc(100% - 216px);
}
</style>
