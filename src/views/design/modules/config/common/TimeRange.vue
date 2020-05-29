<template>
  <a-form-item
    label="时间"
    v-bind="formItemLayout"
  >
    <a-select style="width: 100%" v-model="timeRangeType">
      <a-select-option :value="TIME_RANGE_TYPE_DEFAULT">默认</a-select-option>
      <a-select-option :value="TIME_RANGE_TYPE_RECENT">最近</a-select-option>
      <a-select-option :value="TIME_RANGE_TYPE_CUSTOM">自定义</a-select-option>
    </a-select>

    <div v-show="timeRangeType === TIME_RANGE_TYPE_DEFAULT">

      <a-select
        :filterOption="filterOption"
        showSearch
        style="width: 100%"
        v-model="timeRangeStart"
      >
        <a-select-option
          v-for="option in options.defaultTimeRange"
          :key="option.value"
        >{{ option.name }}</a-select-option>
      </a-select>
    </div>

    <div v-show="timeRangeType === TIME_RANGE_TYPE_RECENT">
      <a-input
        type="number"
        v-model.number="recentValue"
        :min="0"
      >
        <a-select
          :defaultValue="TIME_TYPE_HOURS"
          slot="addonAfter"
          style="width: 80px"
          v-model="recentType"
        >
          <a-select-option
            v-for="option in options.timeRecent"
            :key="option.value"
          >{{ option.name }}</a-select-option>
        </a-select>
      </a-input>
    </div>

    <div v-show="timeRangeType === TIME_RANGE_TYPE_CUSTOM">
      <a-range-picker
        format="YYYY-MM-DD HH:mm"
        :placeholder="['开始时间', '结束时间']"
        style="width: 152%; margin-left: -52%;"
        :show-time="{ format: 'HH:mm' }"
        :valueFormat="TIME_RANGE_FORMAT"
        v-model="customTimeRange"
      />
    </div>
  </a-form-item>
</template>

<script>
import DataSourceMixins from '../dataSourceMixins/index'
import _ from 'lodash'
import {
  DEFAULT_TIME_RANGE_START,
  TIME_RANGE_FORMAT,
  TIME_RANGE_TYPE_DEFAULT,
  TIME_RANGE_TYPE_RECENT,
  TIME_RANGE_TYPE_CUSTOM,
  TIME_TYPE_MINUTES,
  TIME_TYPE_HOURS,
  TIME_TYPE_DAYS,
  TIME_TYPE_WEEKS,
  TIME_TYPE_MONTHS
} from '@/model/config/dataConfig/dynamicData'

const DEFAULT_TIME_RANGE_SELECT_OPTIONS = [
  {
    name: '实时',
    value: Object.assign(DEFAULT_TIME_RANGE_START, {})
  },
  {
    name: '最近15分钟',
    value: Object.assign({}, DEFAULT_TIME_RANGE_START, { [TIME_TYPE_MINUTES]: '-15' })
  },
  {
    name: '最近30分钟',
    value: Object.assign({}, DEFAULT_TIME_RANGE_START, { [TIME_TYPE_MINUTES]: '-30' })
  },
  {
    name: '最近1小时',
    value: Object.assign({}, DEFAULT_TIME_RANGE_START, { [TIME_TYPE_HOURS]: '-1' })
  },
  {
    name: '最近2小时',
    value: Object.assign({}, DEFAULT_TIME_RANGE_START, { [TIME_TYPE_HOURS]: '-2' })
  },
  {
    name: '最近4小时',
    value: Object.assign({}, DEFAULT_TIME_RANGE_START, { [TIME_TYPE_HOURS]: '-4' })
  },
  {
    name: '最近1天',
    value: Object.assign({}, DEFAULT_TIME_RANGE_START, { [TIME_TYPE_DAYS]: '-1' })
  },
  {
    name: '最近1周',
    value: Object.assign({}, DEFAULT_TIME_RANGE_START, { [TIME_TYPE_WEEKS]: '-1' })
  },
  {
    name: '最近2周',
    value: Object.assign({}, DEFAULT_TIME_RANGE_START, { [TIME_TYPE_WEEKS]: '-2' })
  },
  {
    name: '最近1月',
    value: Object.assign({}, DEFAULT_TIME_RANGE_START, { [TIME_TYPE_MONTHS]: '-1' })
  },
  {
    name: '最近2月',
    value: Object.assign({}, DEFAULT_TIME_RANGE_START, { [TIME_TYPE_MONTHS]: '-2' })
  }
]

export default {
  name: 'TimeRange',
  mixins: [DataSourceMixins],
  components: {},
  props: {},
  data: () => ({
    TIME_RANGE_FORMAT,
    TIME_RANGE_TYPE_DEFAULT,
    TIME_RANGE_TYPE_RECENT,
    TIME_RANGE_TYPE_CUSTOM,
    TIME_TYPE_HOURS,
    DEFAULT_TIME_RANGE_SELECT_OPTIONS,
    options: {
      defaultTimeRange: DEFAULT_TIME_RANGE_SELECT_OPTIONS.map(el => ({
        ...el,
        value: JSON.stringify(el.value)
      })),
      timeRecent: [
        {
          name: '分钟',
          value: 'minutes'
        },
        {
          name: '小时',
          value: 'hours'
        },
        {
          name: '天',
          value: 'days'
        },
        {
          name: '周',
          value: 'weeks'
        },
        {
          name: '月',
          value: 'months'
        }
      ]
    }
  }),
  computed: {
    timeRange: {
      get () {
        return _.get(this.config, 'dataConfig.dbDataConfig.timeRange')
      }
    },
    timeRangeStart: {
      get () {
        try {
          return JSON.stringify(this.timeRange.timeRangeStart)
        } catch (e) {
          return null
        }
      },
      set (v) {
        if (this.timeRange) {
          Object.assign(this.timeRange, {
            timeRangeStart: JSON.parse(v)
          })
          this.change()
        }
      }
    },
    timeRangeType: {
      get () {
        return _.get(this.config, 'dataConfig.dbDataConfig.timeRange.timeRangeType', 'default')
      },
      set (v) {
        this.config.dataConfig.dbDataConfig.timeRange.timeRangeType = v
        this.change()
      }
    },
    recentType: {
      get () {
        return _.get(this, 'timeRange.recentType', 'minutes')
      },
      set (recentType) {
        Object.assign(this.timeRange, { recentType })
        this.change()
      }
    },
    recentValue: {
      get () {
        return _.get(this, 'timeRange.recentValue', 0)
      },
      set (recentValue) {
        Object.assign(this.timeRange, { recentValue })
        this.change()
      }
    },
    customTimeRange: {
      get () {
        return _.get(this, 'timeRange.customTimeRange')
      },
      set (customTimeRange) {
        Object.assign(this.timeRange, { customTimeRange })
        this.change()
      }
    }
  },
  methods: {
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>

<style lang="less">

</style>
