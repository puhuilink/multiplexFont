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
  computed: {
    loading: {
      get () {
        return this.$refs['table'] ? this.$refs['table'].localeLoading : false
      },
      set (v) {
        if (this.$refs['table']) {
          this.$refs['table'].localeLoading = v
        }
      }
    }
  },
  methods: {
    refresh () {
      return this.$refs['table'].refresh(arguments)
    }
  },
  render (h) {
    // FIXME: 有时顶部不可见
    // FIXME: td 宽度过大时自动省略号 + tooltip?
    // TODO: 刷新时如何重置排序？场景多在于点击“查询”按钮时，或新增数据时。方案：在 refresh 后新增一个参数用于判断是否要进行排序
    // 顶部查询区域
    const query = <div class="CTable-query">{ this.$slots ? this.$slots.query : '' }</div>
    // 操作区域
    const operation = <div class="CTable-operation">{ this.$slots ? this.$slots.operation : '' }</div>
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
      { operation }
      { table }
    </div>
  },
  updated () {
    console.log(
      this.$slots
    )
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
