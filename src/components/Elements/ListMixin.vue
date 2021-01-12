<script>
import _ from 'lodash'
import uuid from 'uuid/v4'
import { fromEvent, merge } from 'rxjs'
import { takeWhile } from 'rxjs/operators'
import { observeOnMutation } from '@/utils/domUtil'
import { defaultListProprietaryConfig } from '@/model/config/proprietaryConfigs/ListProprietaryConfig'

export default {
  name: 'ListMixin',
  components: {},
  props: {},
  data: () => ({
    elementProps: {
      styleConfig: _.cloneDeep(defaultListProprietaryConfig),
      columns: [],
      dataSource: []
    },
    isSubscribed: true,
    scroll: {
      x: false,
      y: '100%'
    }
  }),
  computed: {
    align () {
      const { elementProps } = this
      return elementProps.styleConfig.align
    },
    columns () {
      const { align, elementProps } = this
      return elementProps.columns.map(column => Object.assign({}, column, { align }))
    },
    dataSource () {
      const { elementProps } = this
      return elementProps.dataSource.map(data => Object.assign({}, data, { uuid: uuid() }))
    },
    headerRowStyle () {
      const { elementProps } = this
      return elementProps.styleConfig.header
    },
    rowStyle () {
      const { elementProps } = this
      return elementProps.styleConfig.rows
    }
  },
  methods: {
    // 实时计算 scroll
    calScroll () {
      this.$table = this.$table || this.$el.getElementsByClassName('ant-table')[0]
      this.$thead = this.$thead || this.$el.getElementsByClassName('ant-table-thead')[0]
      const { height: elHeight } = window.getComputedStyle(this.$el)
      const { height: thHeight } = window.getComputedStyle(this.$thead)

      const elH = Number(elHeight.split('px')[0])
      const thH = Number(thHeight.split('px')[0])

      Object.assign(this.scroll, { y: elH - thH })
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
    merge(
      fromEvent(window, 'resize'),
      // subtree必须为true，当table组件渲染、更新时也能触发
      observeOnMutation(this.$el.parentElement, { attributes: true, childList: false, subtree: true })
    )
      .pipe(
        takeWhile(() => this.isSubscribed)
      )
      .subscribe(() => {
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
  overflow: hidden;

  .ant-table td { white-space: nowrap; }

  .ant-table-thead > tr > th {
    color:inherit !important;
    font-weight: inherit !important;
    background-color: inherit !important;
  }

  .ant-table-header {
    background-color: transparent;
    overflow: hidden !important;
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
