<script>
import CTable from '@/components/Table/CTable'
import _ from 'lodash'
import { triggerWindowResizeEvent } from '@/utils/util'
import OperationNotification from '@/components/OperationNotification'
import QueryBtn from './Button/QueryBtn'
import ResetBtn from './Button/ResetBtn'
import ToggleBtn from './Button/ToggleBtn'

export default {
  name: 'List',
  mixins: [OperationNotification],
  components: {
    CTable,
    QueryBtn,
    ResetBtn,
    ToggleBtn
  },
  props: {
    where: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    // 查询区域是否展开
    advanced: false,
    // 查询区域表单元素布局
    formItemLatout: {
      labelCol: { span: 4 },
      wrapperCol: { span: 14, offset: 2 }
    },
    // 查询参数
    queryParams: {},
    // 选中行
    selectedRows: [],
    // 选中行的 key
    selectedRowKeys: []
  }),
  computed: {
    disabledQuery () {
      const { queryParams } = this
      return _.isEmpty(_.pickBy(queryParams, v => v === 0 || v || v.length))
    },
    hasSelected () {
      return this.selectedRowKeys.length > 0
    },
    hasSelectedOne () {
      return this.selectedRowKeys.length === 1
    },
    rowSelection () {
      const { selectedRows, selectedRowKeys, selectRow: onChange } = this
      return { selectedRows, selectedRowKeys, onChange }
    },
    scrollX () {
      return _.sum(this.columns.map(e => e.width || 60))
    },
    scrollY () {
      return 'calc(100vh - 300px)'
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
    query (firstPage = true) {
      this.$refs['table'].refresh(firstPage)
    },
    /**
     * 重置查询条件
     */
    resetQueryParams () {
      Object.assign(this.$data.queryParams, this.$options.data.apply(this).queryParams)
    },
    /**
     * 重置组件数据
     */
    reset () {
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    /**
     * 表格行选中
     * @event
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
      triggerWindowResizeEvent()
    }
  }
}
</script>

<style lang="less">
.form {}

.fold {
  flex: 1;
  display: inline-block;
  width: calc(100% - 216px);
}

.expand {
  float: right;
  overflow: hidden;
  transform: translateY(15.5px);
}

.collapse {
  float: right;
  overflow: hidden;
  transform: translateY(6.5px);
}

</style>
