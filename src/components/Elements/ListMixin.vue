<script>
import _ from 'lodash'
import uuid from 'uuid/v4'
import { fromEvent, merge } from 'rxjs'
import { takeWhile } from 'rxjs/operators'
import { observeOnMutation } from '@/utils/domUtil'

export default {
  name: 'ListMixin',
  components: {},
  props: {},
  data: () => ({
    elementProps: {},
    isSubscribed: true,
    scroll: {
      x: true,
      y: true
    },
    $table: null,
    $thead: null,
    $observer: null
  }),
  computed: {
    align () {
      return _.get(this, ['elementProps', 'styleConfig', 'align'], 'left')
    },
    columns () {
      const { align } = this
      return _.get(this, ['elementProps', 'columns'], []).map(column => Object.assign({}, column, { align }))
    },
    dataSource () {
      return _.get(this, ['elementProps', 'dataSource'], []).map(data => Object.assign({}, data, { uuid: uuid() }))
    },
    headerRowStyle () {
      return _.get(this, ['elementProps', 'styleConfig', 'header'], {})
    },
    rowStyle () {
      return _.get(this, ['elementProps', 'styleConfig', 'rows'], {})
    }
  },
  methods: {
    // 实时计算 scroll
    calScroll () {
      const { height: elHeight } = window.getComputedStyle(this.$el)
      const { height: thHeight } = window.getComputedStyle(this.$thead)
      // const { height: tableHeight } = window.getComputedStyle(this.$table)

      const elH = Number(elHeight.split('px')[0])
      const thH = Number(thHeight.split('px')[0])
      // const tableH = Number(tableHeight.split('px')[0])

      Object.assign(this.scroll, {
        x: false,
        // TODO: DOM更新延迟导致的计算错误
        // y: tableH > elH ? Math.abs(elH - thH - 48) : false
        y: elH - thH
      })
    },
    customRow (record, index) {
      const { backgroundColor = {}, ...rest } = this.rowStyle
      return {
        style: {
          backgroundColor: index % 2 === 0 ? backgroundColor.odd : backgroundColor.even,
          ...rest
        }
      }
    }
  },
  async mounted () {
    this.$table = this.$el.getElementsByClassName('ant-table')[0]
    this.$thead = this.$el.getElementsByClassName('ant-table-thead')[0]
    merge(
      fromEvent(window, 'resize'),
      observeOnMutation(this.$el.parentElement, { attributes: true, childList: false, subtree: false })
    )
      .pipe(
        takeWhile(() => this.isSubscribed)
      )
      .subscribe(() => {
        this.calScroll()
      })
    // 初始化时触发
    setTimeout(() => {
      this.calScroll()
    })
  },
  beforeDestroy () {
    this.isSubscribed = false
  }

}
</script>

<style lang="less">
.list-element {
  height: 100%;

  .ant-table-thead > tr > th {
    color:inherit !important;
    font-weight: inherit !important;
  }

  .ant-table-scroll {
    .ant-table-body {
      // 隐藏右侧滚动条
      width: calc(100% + 10px);
    }
  }
}
tr > th {
  color:inherit !important;
  font-weight: inherit !important;
}
</style>
