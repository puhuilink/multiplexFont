<template>
  <div class="Cron">
    <a-row class="Cron__paragraph">
      <a-radio-group v-model="_value.interval">
        <a-radio v-for="{ value, label } in typeList" :key="value" :value="value">{{ label }}</a-radio>
      </a-radio-group>
    </a-row>

    <a-row class="Cron__paragraph" v-show="_value.interval === 'w'">
      <a-checkbox-group @change="onWeekChange">
        <a-checkbox v-for="{ value, label } in subTypeList.week" :key="value" :value="value">{{ label }}</a-checkbox>
      </a-checkbox-group>
    </a-row>

    <a-row class="Cron__paragraph" v-show="_value.interval === 'm'">
      <a-checkbox-group @change="onMonthChange">
        <a-checkbox v-for="{ value, label } in subTypeList.month" :key="value" :value="value">{{ label }}</a-checkbox>
      </a-checkbox-group>
    </a-row>
  </div>
</template>

<script>
import mixin from './mixin'
import _ from 'lodash'
const prefixInteger = (num, n) => (Array(n).join(0) + num).slice(-n)

const monthDays = Array(31).fill(null).map((d, index) => prefixInteger(index + 1, 2))

export default {
  name: 'Cron',
  mixins: [mixin],
  components: {},
  props: {},
  data: () => ({
    cron: {
      m: '',
      w: ''
    },
    typeList: [
      {
        value: 'd',
        label: '每天'
      },
      {
        value: 'w',
        label: '每周'
      },
      {
        value: 'm',
        label: '每月'
      }
    ],
    subTypeList: {
      week: [
        {
          value: 7,
          label: '周日'
        },
        {
          value: 1,
          label: '周一'
        },
        {
          value: 2,
          label: '周二'
        },
        {
          value: 3,
          label: '周三'
        },
        {
          value: 4,
          label: '周四'
        },
        {
          value: 5,
          label: '周五'
        },
        {
          value: 6,
          label: '周六'
        }

      ],
      month: Array(31).fill(null).map((item, idx) => ({ value: idx + 1, label: `${prefixInteger(idx + 1, 2)}` }))
    }
  }),
  computed: {
    // TODO: 方向解析
    currentCron () {
      // 具体的时间段在 TimeRange 中处理
      const { _value: { interval } } = this
      const m = this.cron.m || '*'
      const w = this.cron.w || '*'
      if (interval === 'w') {
        return `0 0 * * ${w}`
      } else if (interval === 'm') {
        return `0 0 ? ? ${m} ?`
      } else {
        return '0 0 ? ? * ?'
      }
    }
  },
  methods: {
    onWeekChange (e = []) {
      const days = e.sort()
      if (_.isEqual([1, 2, 3, 4, 5, 6, 7], days)) {
        this.cron.w = '*'
      } else {
        this.cron.w = days.length ? days.join(',') : '?'
      }
    },
    onMonthChange (e = []) {
      const days = e.sort()
      if (_.isEqual(monthDays, days)) {
        this.cron.m = '*'
      } else {
        this.cron.m = days.length ? days.join(',') : '?'
      }
    }
  }
}
</script>

<style lang="less">
.Cron {
  min-height: 90px;

  &__paragraph {
    margin-top: 10px;
  }

  .ant-checkbox-wrapper {
    margin-left: 8px;
  }
}
</style>
