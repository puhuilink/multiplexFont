<script>
import _ from 'lodash'
import uuid from 'uuid/v4'

export default {
  name: 'ListMixin',
  components: {},
  props: {
    elementProps: {
      type: Object,
      default: () => ({
        columns: [],
        dataSource: [],
        loading: false
      })
    }
  },
  data: () => ({
    scroll: {
      x: true,
      y: true
    },
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
      Object.assign(this.scroll, {
        x: true,
        y: Number(elHeight.split('px')[0]) - Number(thHeight.split('px')[0])
      })
    }
  },
  mounted () {
    this.$thead = this.$el.getElementsByClassName('ant-table-thead')[0]
    this.calScroll()
    this.$observer = new MutationObserver(_.debounce(this.calScroll, 60))
    this.$observer.observe(this.$el.parentElement, { attributes: true, childList: false, subtree: false })
  },
  beforeDestroy () {
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
