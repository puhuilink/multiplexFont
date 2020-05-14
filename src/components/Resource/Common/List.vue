
<script>
export default {
  name: 'List',
  components: {},
  props: {
    where: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    // 查询栏是否展开
    advanced: false,
    // 选中行
    selectRows: [],
    // 选中行的 key
    selectedRowKeys: []
  }),
  computed: {
    scrollX () {
      return this.columns
        .map(e => e.width || 60)
        .reduce((a, b) => a + b)
    }
  },
  methods: {
    /**
     * 查询
     */
    query () {
      this.$refs['table'].refresh(true)
    },
    /**
     * 重置查询条件
     */
    resetQueryParams () {
      Object.assign(this.$data.queryParams, this.$options.data.apply(this).queryParams)
    },
    /**
     * 重置组件数据
     */
    reset () {
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    /**
     * 表格行选中
     */
    selectRow (selectedRowKeys, selectRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectRows = selectRows
    },
    /**
     * 切换查询栏展开状态
     * @event
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>

<style lang="less">
.fold {
  display: inline-block;
  width: calc(100% - 216px);
}
</style>
