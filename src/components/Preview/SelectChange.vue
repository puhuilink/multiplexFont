<script>
export default {
  name: 'SelectChangeMixin',
  methods: {
    /**
     *  通过冒泡事件实现组件间的通信
     */
    selectChanged (value) {
      const [ name, id ] = value
      const indexArr = []
      this.view.widgets.map((el, index, arr) => {
        if (el.config.type === 'Global') {
          indexArr.push(index)
          arr[index].config.dataConfig.dbDataConfig.ormConfig.cache = id
        }
      })
      // indexArr.forEach(async el => {
      //   await this.view.widgets[el].render.refresh()
      // })
      indexArr.map(el => this.view.widgets[el].render.refresh())
    }
  }
}
</script>

<style scoped>

</style>
