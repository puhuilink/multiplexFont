<script>
import GraphTable from './GraphTable'

export default {
  // custom table
  name: 'CTable',
  props: {
    ...GraphTable.props,
    pagination: {
      type: Object,
      default: () => ({
        // TODO: 查询全部
        pageSizeOptions: ['50', '100'],
        defaultCurrent: 1,
        pageSize: 50,
        defaultPageSize: 50,
        hideOnSinglePage: false,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, [start, end]) => `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`
      })
    },
    size: {
      type: String,
      default: 'small',
      validator: size => ['default', 'middle', 'small'].includes(size)
    }
  },
  methods: {
    refresh () {
      return this.$refs['table'].refresh(arguments)
    }
  },
  render (h) {
    // 顶部查询区域
    const query = <div class="CTable-query">{ this.$slots.query }</div>
    // 操作区域
    const opration = <div class="CTable-operation">{ this.$slots.opration }</div>
    // 表格区域
    const table = h(GraphTable, {
      ref: 'table',
      props: {
        ...this.$props,
        ...this.$attrs,
        pageSize: this.pagination.pageSize
      },
      on: {
        ...this.$listeners
      },
      scopedSlots: {
        ...this.$scopedSlots
      }
    })
    return <div class="CTable">
      { query }
      { opration }
      { table }
    </div>
  }
}
</script>

<style lang="less">
.CTable {
  & > * {
    padding: 8px 0;
  }

  &-operation {
    & button {
      margin-right: 5px;
    }
  }

  td {
    white-space: nowrap;
  }
}
</style>
