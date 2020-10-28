<script>
import _ from 'lodash'
import uuid from 'uuid/v4'
import { fromEvent } from 'rxjs'
import { takeWhile } from 'rxjs/operators'

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
  mounted () {
    // TODO: use fromEvent 或 watch + cb
    this.$table = this.$el.getElementsByClassName('ant-table')[0]
    this.$thead = this.$el.getElementsByClassName('ant-table-thead')[0]
    this.calScroll()
    this.$observer = new MutationObserver(_.debounce(this.calScroll, 60))
    this.$observer.observe(this.$el.parentElement, { attributes: true, childList: false, subtree: false })
    fromEvent(window, 'resize')
      .pipe(
        takeWhile(() => this.isSubscribed)
      )
      .subscribe(() => {
        this.calScroll()
      })
  },
  beforeDestroy () {
    this.isSubscribed = false
    this.$observer.disconnect()
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
}
tr > th {
  color:inherit !important;
  font-weight: inherit !important;
}
</style>
