<template>
  <div class="'RealDataSource'">
    <a-tooltip placement="top" title="加载真实数据" arrowPointAtCenter>
      <a-button :loading="btnLoading" :disabled="!available" @click="change(true)">预览</a-button>
    </a-tooltip>

    <!-- / 横轴类型 -->
    <a-form-item
      label="横轴类型"
      v-bind="formItemLayout"
      v-if="useXAxisType"
    >
      <a-select style="width: 100%" v-model="xAxisType">
        <a-select-option
          v-for="(option, idx) in options.xAxisType"
          :key="idx"
          :value="option.value"
        >
          {{ option.name }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <!-- / 查询时间 -->
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

        <a-select style="width: 100%" v-model="timeRangeStart">
          <a-select-option
            v-for="(option, idx) in DEFAULT_TIME_RANGE_SELECT_OPTIONS"
            :key="idx"
            :value="option.value"
          >
            {{ option.name }}
          </a-select-option>
        </a-select>
      </div>

      <div v-show="timeRangeType === TIME_RANGE_TYPE_RECENT">
        <a-input
          type="number"
          v-model.number="recentValue"
          :min="0"
        >
          <a-select style="width: 80px" defaultValue="hours" slot="addonAfter" v-model="recentType">
            <a-select-option v-for="option in options.timeRecent" :key="option.value" :value="option.value">
              {{ option.name }}
            </a-select-option>
          </a-select>
        </a-input>
      </div>

      <div v-show="timeRangeType === TIME_RANGE_TYPE_CUSTOM">
        <a-range-picker
          v-model="customTimeRange"
          style="width: 100%"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          :valueFormat="TIME_RANGE_FORMAT"
          :placeholder="['开始时间', '结束时间']"
        />
      </div>
    </a-form-item>

    <!-- / 数据源 -->
    <ComboSelect
      v-bind="{ multiple: false, hasDetailInstance: true, ...comboSelectProps }"
      v-model="resourceConfig"
      v-if="useComboSelect"
    />

    <!-- / 刷新时间 -->
    <a-form-item
      label="刷新时间"
      v-bind="formItemLayout"
      v-if="useRefreshTime"
    >
      <a-input
        :min="0"
        :parser="num => (Number(num) >= 0 ? Number(num) : 0).toFixed(0)"
        suffix="分钟"
        type="number"
        v-model.number="refreshTime"
      />
    </a-form-item>

    <!-- / 外部 Ci 可用 -->
    <a-form-item
      label="外部CI可用"
      v-bind="formItemLayout"
      v-if="useExternalCi"
    >
      <a-checkbox
        :checked="!!externalCi"
        @input="externalCi = $event"
      />
    </a-form-item>
  </div>
</template>

<script>
import DataSourceMixins from '../dataSourceMixins/index'
import { ComboSelect } from '@/components/Common'
import _ from 'lodash'
import {
  TIME_RANGE_FORMAT,
  TIME_RANGE_TYPE_DEFAULT,
  TIME_RANGE_TYPE_RECENT,
  TIME_RANGE_TYPE_CUSTOM
} from '@/model/config/dataConfig/dynamicData'

export default {
  name: 'RealDataSource',
  mixins: [DataSourceMixins],
  components: {
    ComboSelect
  },
  props: {
    useComboSelect: {
      type: Boolean,
      default: true
    },
    comboSelectProps: {
      type: Object,
      default: () => ({})
    },
    useExternalCi: {
      type: Boolean,
      default: true
    },
    useRefreshTime: {
      type: Boolean,
      default: true
    },
    useTimeRange: {
      type: Boolean,
      default: false
    },
    useXAxisType: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    TIME_RANGE_FORMAT,
    TIME_RANGE_TYPE_DEFAULT,
    TIME_RANGE_TYPE_RECENT,
    TIME_RANGE_TYPE_CUSTOM,
    options: {
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
        return this.config.dataConfig.dbDataConfig.timeRange
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
  methods: {}
}
</script>

<style scoped lang="less">
</style>
