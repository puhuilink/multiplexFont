<script>
import STable from './index'
import './index.less'

export default {
  // custom table
  name: 'GraphTable',
  extends: STable,
  props: {
    ...STable.props
  },
  methods: {
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    loadData (pagination, filters, sorter) {
      this.localLoading = true
      const pageNo = (pagination && pagination.current) || this.showPagination && this.localPagination.current || this.pageNum
      const pageSize = (pagination && pagination.pageSize) || this.showPagination && this.localPagination.pageSize || this.pageSize
      const parameter = Object.assign({
        limit: pageSize,
        offset: (pageNo - 1) * pageSize
      },
      (sorter && sorter.field && sorter.order && {
        orderBy: {
          [`${sorter.field}`]: sorter.order === 'descend' ? 'desc' : 'asc'
        }
      }) || {}
      )
      const result = this.data(parameter)
      // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.data
      // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then(r => {
          // hack
          r.pageNo = r.pageNo || pageNo
          // 重置选中项
          this.clearSelected()
          this.localPagination = this.showPagination && Object.assign({}, this.localPagination, {
            current: r.pageNo, // 返回结果中的当前分页数
            // hack
            total: r.totalCount || r.pagination.aggregate.count, // 返回结果中的总记录数
            showSizeChanger: this.showSizeChanger,
            pageSize: (pagination && pagination.pageSize) ||
              this.localPagination.pageSize
          }) || false
          // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
          if (r.data.length === 0 && this.showPagination && this.localPagination.current > 1) {
            this.localPagination.current--
            this.loadData()
            return
          }
          this.localDataSource = r.data // 返回结果中的数组数据
          this.localLoading = false
        })
          .catch(e => {
            this.reset()
            throw e
          })
      } else {
        this.reset()
      }
    },
    reset () {
      const initialData = this.$options.data.apply(this)
      Object.assign(this.$data, initialData)
      this.localPagination = this.showPagination ? Object.assign({}, this.localPagination, {
        current: 1,
        total: 0
      }) : false
    }
  }
}
</script>
