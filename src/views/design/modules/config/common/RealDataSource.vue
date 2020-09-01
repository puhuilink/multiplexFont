<template>
  <div class="RealDataSource">
    <a-tooltip placement="top" title="加载真实数据" arrowPointAtCenter>
      <!-- :disabled="!available"  -->
      <a-button
        :loading="btnLoading"
        @click="change(true)"
      >预览</a-button>
      <!-- <a-button @click="preview">预览</a-button> -->
    </a-tooltip>

    <!-- / 横轴类型 -->
    <a-form-item
      label="横轴类型"
      v-bind="formItemLayout"
      v-if="useXAxisType"
    >
      <a-select style="width: 100%" v-model="xAxisType" @select="change">
        <a-select-option
          v-for="(option, idx) in options.xAxisType"
          :key="idx"
          :value="option.value"
        >
          {{ option.label }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <!-- / 图例内容 -->
    <a-form-item
      label="图例内容"
      v-bind="formItemLayout"
      v-if="useLegendType"
    >
      <a-select
        class="fw"
        v-model="legendType"
        @change="change"
      >
        <a-select-option v-for="option in legendTypeList" :key="option.value">{{ option.label }}</a-select-option>
      </a-select>
    </a-form-item>

    <!-- / 查询时间 -->
    <TimeRange v-if="useTimeRange" />

    <!-- / 计算类型 -->
    <a-form-item
      label="计算类型"
      v-bind="formItemLayout"
      v-if="useRefreshTime"
    >
      <a-select
        allowClear
        class="fw"
        v-model="resourceConfig.calculateType"
        @change="change"
      >
        <a-select-option
          v-for="option in calculateTypeList"
          :key="option.value"
        >{{ option.label }}</a-select-option>
      </a-select>
    </a-form-item>

    <!-- / 分组 -->
    <a-form-item
      label="分组"
      v-bind="formItemLayout"
      v-if="useRefreshTime"
    >
      <a-select
        allowClear
        class="fw"
        v-model="resourceConfig.isGroup"
        @change="change"
      >
        <a-select-option
          v-for="option in groupList"
          :key="option.value"
        >{{ option.label }}</a-select-option>
      </a-select>
    </a-form-item>

    <!-- / 数据源 -->
    <ComboSelect
      v-bind="{ multiple: false, hasDetailInstance: true, ...comboSelectProps }"
      v-model="resourceConfig"
      v-if="useComboSelect"
      ref="comboSelect"
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
import { ComboSelect } from '@/components/Resource'
import TimeRange from './TimeRange'
import _ from 'lodash'

export default {
  name: 'RealDataSource',
  mixins: [DataSourceMixins],
  components: {
    ComboSelect,
    TimeRange
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
    useLegendType: {
      type: Boolean,
      default: false
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
    calculateTypeList: [
      {
        label: '求和',
        value: 'total'
      },
      {
        label: '最大值',
        value: 'max'
      },
      {
        label: '均值',
        value: 'average'
      }
    ],
    groupList: [
      {
        label: '精确到分',
        value: 'minute'
      },
      {
        label: '精确到小时',
        value: 'hour'
      },
      {
        label: '精确到天',
        value: 'day'
      }
    ],
    legendTypeList: [
      {
        label: 'Ci',
        value: 'ci'
      },
      {
        label: 'Instance',
        value: 'instance'
      },
      {
        label: 'Kpi',
        value: 'kpi'
      }
    ]
  }),
  computed: {
    legendType: {
      set (legendType) {
        // TODO: 此处先按单选实现，后期扩展为多选，始终以数组传递，方便向后兼容
        legendType = Array.isArray(legendType) ? legendType : [legendType]
        Object.assign(this.config.dataConfig.dbDataConfig, { legendType })
      },
      get () {
        return _.get(this, 'config.dataConfig.dbDataConfig.legendType', ['ci'])
      }
    }
  },
  methods: {
    preview () {
      // const { data } = await CmdbService.latestMetric()
      this.$refs['comboSelect'].preview()
    }
  }
}
</script>

<style scoped lang="less">
</style>
