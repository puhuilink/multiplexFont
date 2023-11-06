<template>
  <div class="TimeRange">
    <a-table
      :columns="columns"
      :dataSource="interval.dataSource"
      :pagination="false"
      ref="table"
      rowKey="uuid"
      class="custom-table"
      bordered
      :scroll="scroll"
    >
    </a-table>
    <div class="TimeRange__operation">
      <a-button type="primary" @click="add">新增</a-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { TimeRangeModel } from './TimeRangeModel'
import EditableRow from './EditableRow.vue'
import { scrollTo } from '@/utils/util'

export const timeRangeRule = {
  interval: [
    {
      required: true,
      message: '请选择生效时间段',
      validator (rule, value, callback) {
        // if (value === '') {
        //   callback(new Error('Please input the password again'))
        // } else if (value !== this.ruleForm.pass) {
        //   callback(new Error("Two inputs don't match!"))
        // } else {
        //   callback()
        // }
        callback()
      },
      trigger: 'change'
    }
  ]
}

export default {
  name: 'TimeRange',
  components: {},
  props: {
    interval: {
      type: Object,
      default: new TimeRangeModel()
    }
  },
  data () {
    return {
      columns: [
        {
          title: '开始时间',
          width: 300,
          customRender: (text, { start }) => {
            return (
              <EditableRow
                value={start}
                onChange={(value) => {
                  Object.assign(start, value)
                }}
              />
            )
          }
        },
        {
          title: '结束时间',
          width: 300,
          customRender: (text, { end }) => {
            return (
              <EditableRow
                value={end}
                onChange={(value) => {
                  Object.assign(end, value)
                }}
              />
            )
          }
        },
        {
          title: '操作',
          width: 170,
          align: 'center',
          customRender: (text, record, index) => <a-icon type="delete" onClick={() => { this.remove(index) }} />
        }
      ]
    }
  },
  computed: {
    scroll () {
      return {
        y: 400
      }
    }
  },
  methods: {
    moment,
    add () {
      this.interval.add()
      this.$nextTick(() => {
        const { table: { $children: [child] } } = this.$refs
        const { vcTable } = child.$refs
        this.$scrollTable = this.$scrollTable || vcTable.getBodyTable()
        scrollTo(this.$scrollTable.scrollHeight, { getContainer: () => this.$scrollTable })
      })
    },
    remove (index) {
      this.interval.remove(index)
    }
  }
}
</script>

<style lang="less" scoped>
.TimeRange {
  &__operation {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/ .ant-table-header .ant-table-thead > tr > th {
    background-color: rgb(249, 250, 251) !important;
    text-align: center;
    /* 其他样式规则 */
  }
  /deep/ .ant-table-wrapper {
    padding: 0 !important;
  }
}
</style>
