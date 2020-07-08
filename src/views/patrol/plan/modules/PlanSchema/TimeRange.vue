<template>
  <div class="TimeRange">
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :rowKey="`${Math.random()}`"
      :scroll="scroll"
    ></a-table>
    <a-button @click="add">新增</a-button>
  </div>
</template>

<script>
import mixin from './mixin'
const mockData = '07:45-09:30,09:45-11:30,11:45-13:30,13:45-15:00'.split(',').map(el => ({ value: el.split('-') }))

export default {
  name: 'TimeRange',
  mixins: [mixin],
  components: {},
  props: {},
  data () {
    return {
      columns: [
        {
          title: '开始时间',
          width: 180,
          customRender: (text, { value }) => value[0]
        },
        {
          title: '结束时间',
          width: 180,
          customRender: (text, { value }) => value[1]
        },
        {
          title: '操作',
          width: 180,
          customRender: (text, { value }, index) => <a-icon type="delete" onClick={() => this.remove(index)} />
        }
      ],
      dataSource: mockData
    }
  },
  computed: {
    scroll () {
      return {
        y: 230
      }
    }
  },
  methods: {
    add () {
      this.dataSource.push({
        value: ['07:45', '09:45']
      })
    },
    remove (idx) {
      this.dataSource.splice(idx, 1)
    }
  }
}
</script>

<style lang="less">
// .TimeRange {
  // table {
    // min-height: 230px;
  // }
// }
</style>
