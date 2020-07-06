<template>
  <div class="Cron">
    <a-row class="Cron__paragraph">
      <a-radio-group v-model="value.interval">
        <a-radio v-for="{ value, label } in typeList" :key="value" :value="value">{{ label }}</a-radio>
      </a-radio-group>
    </a-row>

    <a-row class="Cron__paragraph">
      <a-checkbox v-for="{ value, label } in currentSubTypeList" :key="value" :value="value">{{ label }}</a-checkbox>
    </a-row>
  </div>
</template>

<script>
import mixin from './mixin'
const prefixInteger = (num, n) => (Array(n).join(0) + num).slice(-n)

export default {
  name: 'Cron',
  mixins: [mixin],
  components: {},
  props: {},
  data: () => ({
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
      day: [
        {
          value: 'd',
          label: '周日'
        },
        {
          value: 'd',
          label: '周一'
        },
        {
          value: 'd',
          label: '周二'
        },
        {
          value: 'd',
          label: '周三'
        },
        {
          value: 'd',
          label: '周四'
        },
        {
          value: 'd',
          label: '周五'
        },
        {
          value: 'd',
          label: '周六'
        }

      ],
      month: Array(31).fill(null).map((item, idx) => ({ value: idx + 1, label: `${prefixInteger(idx + 1, 2)}` }))
    }
  }),
  computed: {
    currentSubTypeList () {
      const { value: { interval = 'm' }, subTypeList: { day, month } } = this
      switch (interval) {
        case 'w':
          return day
        case 'm':
          return month
        default:
          return []
      }
    }
  },
  methods: {
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
