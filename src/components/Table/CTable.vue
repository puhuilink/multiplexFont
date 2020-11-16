<script>
import GraphTable from './GraphTable'
import _ from 'lodash'
import { resizeableTitleHOC } from './ResizeableTitle'

const defaultPagination = {
  // TODO: 查询全部
  pageSizeOptions: ['50', '100'],
  defaultCurrent: 1,
  pageSize: 50,
  defaultPageSize: 50,
  hideOnSinglePage: false,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: (total, [start, end]) => `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`
}

export default {
  // custom table
  name: 'CTable',
  props: {
    ..._.omit(GraphTable.props, ['loading']),
    showPagination: {
      type: Boolean,
      default: true
    },
    pagination: {
      type: Object,
      default: () => Object.assign({}, defaultPagination)
    },
    size: {
      type: String,
      default: 'small',
      validator: size => ['default', 'middle', 'small'].includes(size)
    },
    resizeableTitle: {
      type: Boolean,
      default: false
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
    // 顶部查询区域
    const query = <div class={{
      'CTable-query': true,
      'CTable-query_hidden': !this.$slots.query
    }}>{ this.$slots.query ? this.$slots.query : '' }</div>
    // 操作区域
    const operation = <div class={{
      'CTable-operation': true,
      'CTable-operation_hidden': !this.$slots.operation
    }}>{ this.$slots.operation ? this.$slots.operation : '' }</div>

    // 允许增量入参
    const pagination = Object.assign({}, defaultPagination, this.$props.pagination)
    const columns = this.$props.columns || []

    // 表格区域
    const table = h(GraphTable, {
      ref: 'table',
      props: {
        ..._.omit(this.$props, 'resizeableTitle'),
        ...this.resizeableTitle ? {
          bordered: true,
          components: {
            header: {
              cell: resizeableTitleHOC(columns)
            }
          }
        } : {},
        ...this.$attrs,
        pagination,
        showPagination: this.showPagination,
        columns: columns.map(column => ({
          ellipsis: true,
          ...column.tooltip ? {
            customRender: v => {
              let value = v
              if (typeof v === 'boolean') {
                value = `${value}`
              }
              // TODO: px vh?
              const { width = 0 } = column
              const length = _.get(value, 'length', 0) * 14
              // TODO: 截断 tooltip title
              // TODO: 中英文字符宽度不一致
              return (value && length > width) ? (
                <a-tooltip title={value} placement="topLeft">
                  <span>{value}</span>
                </a-tooltip>
              ) : value
            }
          } : {},
          ...column })),
        pageSize: pagination.pageSize
      },
      on: {
        ...this.$listeners
      },
      scopedSlots: {
        ..._.omit(this.$scopedSlots, ['query', 'operation'])
      }
    })

    // FIXME: 插槽更新时，其余部分也会触发 render
    // https://github.com/vuejs/vue/issues/6351
    // beta 版已修复
    // https://github.com/vuejs/vue/releases/tag/v2.6.0-beta.2
    return <div class="CTable">
      { query }
      { operation }
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

  &-query {
    &_hidden {
      display: none;
    }
  }

  &-operation {
    &_hidden {
      display: none;
    }
    // min-height: 48px;
    & button {
      margin-right: 5px;
    }
  }

  td {
    white-space: nowrap;
  }
}
</style>
