<template>
  <a-form-item
    class="TimeRange"
    label="时间"
    v-bind="formItemLayout"
  >

    <!-- / 类型选择 -->
    <a-select v-model="timeRangeConfig.timeRangeType" @select="change()">
      <a-select-option :value="TIME_RANGE_TYPE_DEFAULT">默认</a-select-option>
      <a-select-option :value="TIME_RANGE_TYPE_RECENT">最近</a-select-option>
      <a-select-option :value="TIME_RANGE_TYPE_CUSTOM">自定义</a-select-option>
    </a-select>

    <!-- / 默认 -->
    <div v-show="timeRangeConfig.timeRangeType === TIME_RANGE_TYPE_DEFAULT">
      <a-select
        :filterOption="filterOption"
        showSearch
        v-model="startTime"
        @select="change()"
      >
        <a-select-option
          v-for="option in options.defaultTimeRange"
          :key="option.value"
        >{{ option.name }}</a-select-option>
      </a-select>
    </div>

    <!-- / 最近 -->
    <div v-show="timeRangeConfig.timeRangeType === TIME_RANGE_TYPE_RECENT">
      <a-input
        type="number"
        :value="(timeRangeConfig.recentValue || 0) * -1"
        @change="$event => {
          timeRangeConfig.recentValue = ($event.target.value || 0) * -1
          change()
        }"
        :min="0"
      >
        <a-select
          :defaultValue="TIME_TYPE_HOURS"
          slot="addonAfter"
          style="width: 80px"
          v-model="timeRangeConfig.recentType"
          @select="change()"
        >
          <a-select-option
            v-for="option in options.timeRecent"
            :key="option.value"
          >{{ option.name }}</a-select-option>
        </a-select>
      </a-input>
    </div>

    <!-- / 自定义 -->
    <div v-show="timeRangeConfig.timeRangeType === TIME_RANGE_TYPE_CUSTOM">
      <a-range-picker
        :allowClear="false"
        class="TimeRange__date_picker"
        format="YYYY-MM-DD HH:mm"
        :placeholder="['开始时间', '结束时间']"
        :show-time="{ format: 'HH:mm' }"
        :valueFormat="TIME_RANGE_FORMAT"
        v-model="timeRangeConfig.customTimeRange"
        @ok="change()"
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
} from '@/model/config/dataConfig/dynamicData/common/TimeRangeConfig'

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
  data: () => ({
    TIME_RANGE_FORMAT,
    TIME_RANGE_TYPE_DEFAULT,
    TIME_RANGE_TYPE_RECENT,
    TIME_RANGE_TYPE_CUSTOM,
    TIME_TYPE_HOURS,
    DEFAULT_TIME_RANGE_SELECT_OPTIONS,
    options: {
      defaultTimeRange: DEFAULT_TIME_RANGE_SELECT_OPTIONS.map(({ name, value }) => ({ name, value: JSON.stringify(value) })),
      timeRecent: [
        { name: '分钟', value: TIME_TYPE_MINUTES },
        { name: '小时', value: TIME_TYPE_HOURS },
        { name: '天', value: TIME_TYPE_DAYS },
        { name: '周', value: TIME_TYPE_WEEKS },
        { name: '月', value: TIME_TYPE_MONTHS }
      ]
    }
  }),
  computed: {
    timeRangeConfig () {
      return _.get(this, 'config.dataConfig.dbDataConfig.timeRangeConfig', {})
    },
    startTime: {
      get () {
        try {
          return JSON.stringify(this.timeRangeConfig.startTime)
        } catch (e) {
          return null
        }
      },
      set (startTime) {
        this.timeRangeConfig.startTime = JSON.parse(startTime)
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
.TimeRange {
  .ant-select {
    width: 100%;
  }
  &__date_picker {
    margin: -50% !important;
    width: 150% !important;
  }
}
</style>
