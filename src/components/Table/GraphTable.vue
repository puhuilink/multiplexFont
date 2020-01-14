<script>
import STable from './index'
import './index.less'

export default {
  // custom table
  name: 'CTable',
  extends: STable,
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
        [`${sorter.field}`]: sorter.order === 'descend' ? 'desc' : 'asc'
      }) || {}
      )
      const result = this.data(parameter)
      // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.data
      // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then(r => {
          // hack
          r.pageNo = pageNo
          // TODO: 重置 selectedRows?
          this.localPagination = this.showPagination && Object.assign({}, this.localPagination, {
            current: r.pageNo, // 返回结果中的当前分页数
            total: r.pagination.aggregate.count, // 返回结果中的总记录数
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

          // 这里用于判断接口是否有返回 r.totalCount 且 this.showPagination = true 且 pageNo 和 pageSize 存在 且 totalCount 小于等于 pageNo * pageSize 的大小
          // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
          // @abort
          // try {
          //   if ((['auto', true].includes(this.showPagination) && r.totalCount <= (r.pageNo * this.localPagination.pageSize))) {
          //     this.localPagination.hideOnSinglePage = true
          //   }
          // } catch (e) {
          //   this.localPagination = false
          // }
          console.log('loadData -> this.localPagination', this.localPagination)
          this.localDataSource = r.data // 返回结果中的数组数据
          this.localLoading = false
        })
      }
    }
  }
}
</script>
