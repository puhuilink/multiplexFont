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

    <a-form-model-item prop="range">
      <a-range-picker
        v-model="_value.range"
      />
    </a-form-model-item>
  </div>
</template>

<script>
import mixin from './mixin'
import moment from 'moment'
const MOMENT_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const mockData = '07:45-09:30,09:45-11:30,11:45-13:30,13:45-15:00'.split(',').map(el => ({ value: el.split('-') }))

export const timeRangeRule = {
  range: [
    {
      required: true,
      message: '请选择生效时间段',
      validator (rule, value, callback) {
        console.log(rule, value)
        if (value === '') {
          callback(new Error('Please input the password again'))
        } else if (value !== this.ruleForm.pass) {
          callback(new Error("Two inputs don't match!"))
        } else {
          callback()
        }
      }
    }
  ]
}

export default {
  name: 'TimeRange',
  mixins: [mixin],
  components: {},
  props: {},
  data () {
    return {
      MOMENT_FORMAT,
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
    test () {
      return [
        this.plan.effect_time,
        this.plan.expire_time
      ]
    },
    scroll () {
      return {
        y: 230
      }
    }
  },
  methods: {
    moment,
    add () {
      this.dataSource.push({
        value: ['07:45', '09:45']
      })
    },
    remove (idx) {
      this.dataSource.splice(idx, 1)
    },
    onRangeChange (dates, dateStrings) {
      console.log(dates, dateStrings)
      const [effect_time, expire_time] = dateStrings
      // Object.assign(this._value, { effect_time, expire_time })
      this._value.effect_time = effect_time
      this._value.expire_time = expire_time
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
