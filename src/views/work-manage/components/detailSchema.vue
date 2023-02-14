<template>
  <a-modal
    title="查看排班"
    width="800"
    :visible="visible"
    centered
    @cancel="onCancel"
  >
    <a-calendar>
      <ul slot="dateCellRender" slot-scope="value" class="events">
        <li v-for="item in getListData(value)" :key="item.content">
          <a-badge :status="item.type" :text="item.content" />
        </li>
      </ul>
      <template slot="monthCellRender" slot-scope="value">
        <div v-if="getMonthData(value)" class="notes-month">
          <section>{{ getMonthData(value) }}</section>
          <span>Backlog number</span>
        </div>
      </template>
    </a-calendar>
  </a-modal>
</template>

<script>
import Schema from '~~~/Mixins/Modal/Schema'

export default {
  name: 'DetailSchema',
  mixins: [Schema],
  methods: {
    getListData (value) {
      let listData
      switch (value.date()) {
        case 8:
          listData = [
            { type: 'warning', content: '张三' },
            { type: 'success', content: '张三' }
          ]
          break
        case 10:
          listData = [
            { type: 'warning', content: '张三' },
            { type: 'success', content: '张三' }
          ]
          break
        case 15:
          listData = [
            { type: 'warning', content: '张三' },
            { type: 'success', content: '张三' }
          ]
          break
        default:
      }
      return listData || []
    },
    getMonthData (value) {
      if (value.month() === 8) {
        return 1394
      }
    },
    onShow () {
      this.visible = true
    },
    onCancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
