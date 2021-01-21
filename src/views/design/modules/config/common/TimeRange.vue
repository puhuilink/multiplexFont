<template>
  <a-form-item
    class="TimeRange"
    label="查询时间"
    v-bind="formItemLayout"
  >

    <!-- / 类型选择 -->
    <a-select v-model="timeRangeConfig.timeRangeType" @change="change()">
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
        @change="change()"
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
        :min="1"
      >
        <a-select
          :defaultValue="TIME_TYPE_HOURS"
          slot="addonAfter"
          style="width: 80px"
          v-model="timeRangeConfig.recentType"
          @change="change()"
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
        format="YY-MM-DD HH:mm"
        :placeholder="['开始时间', '结束时间']"
        :showTime="{ format: 'HH:mm' }"
        :valueFormat="TIME_RANGE_FORMAT"
        v-model="timeRangeConfig.customTimeRange"
        @ok="change()"
      />
    </div>
  </a-form-item>
</template>

<script>
import DataSourceMixins from '../dataSourceMixins/index'
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
import {
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_ALARM,
  SOURCE_TYPE_OVERVIEW,
  SOURCE_TYPE_COMBO
} from '@/model/config/dataConfig/dynamicData/types/sourceType'

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
  props: {
    type: {
      type: String,
      default: SOURCE_TYPE_REAL,
      validator: type => [SOURCE_TYPE_REAL, SOURCE_TYPE_ALARM, SOURCE_TYPE_OVERVIEW].includes(type)
    }
  },
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
      const { dbDataConfig } = this.config.dataConfig

      switch (this.type) {
        case SOURCE_TYPE_ALARM:
          return dbDataConfig.alarmConfig.timeRangeConfig || {}
        case SOURCE_TYPE_OVERVIEW:
          return dbDataConfig.overviewConfig.timeRangeConfig || {}
        case SOURCE_TYPE_REAL:
          return dbDataConfig.resourceConfig.timeRangeConfig || {}
        case SOURCE_TYPE_COMBO:
          return dbDataConfig.comboConfig.timeRangeConfig || {}
        default:
          return {}
      }
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
    margin: -52% !important;
    width: 155% !important;
  }

  .ant-calendar-picker-input.ant-input {
    padding: 0;
    padding-left: 8px;
  }
}
</style>
