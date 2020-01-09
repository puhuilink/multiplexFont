<script>
import Table from 'ant-design-vue/es/table/Table'

export default {
  name: 'GraphTable',
  extends: Table,
  props: {
    pagination: {
      type: Object,
      default: () => ({
        pageSizeOptions: ['10', '15', '30', '50'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, [start, end]) => `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`
      })
    }
  },
  render (h) {
    // 顶部查询区域
    const query = <div class="GraphTable-query">{ this.$slots.query }</div>
    // 操作区域
    const opration = <div class="GraphTable-operation">{ this.$slots.opration }</div>
    // 表格区域
    const table = h(Table, {
      class: 'GraphTable-table',
      props: {
        ...this.$props,
        ...this.$attrs
      },
      on: {
        ...this.$listeners
      },
      scopedSlots: {
        ...this.$scopedSlots
      }
    })
    return <div class="GraphTable">
      { query }
      { opration }
      { table }
    </div>
  }
}
</script>

<style lang="less">
.GraphTable {
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
