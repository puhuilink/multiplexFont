<template>
  <div class="RealDataSource">
    <a-tooltip placement="top" title="加载真实数据" arrowPointAtCenter>
      <a-button :loading="btnLoading" :disabled="!available" @click="change(true)">预览</a-button>
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
          {{ option.name }}
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
        style="width: 100%"
        v-model="legendType"
        @change="change"
      >
        <a-select-option v-for="option in legendTypeList" :key="option.value">{{ option.name }}</a-select-option>
      </a-select>
    </a-form-item>

    <!-- / 查询时间 -->
    <TimeRange v-if="useTimeRange" />

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
    legendTypeList: [
      {
        name: 'Ci',
        value: 'ci'
      },
      {
        name: 'Instance',
        value: 'instance'
      },
      {
        name: 'Kpi',
        value: 'kpi'
      }
    ]
  }),
  computed: {
    legendType: {
      set (legendType) {
        // TODO: 此处先按单选实现，后期扩展为多选，始终以数组传递，方便向后兼容
        legendType = Array.isArray(legendType) ? legendType : [legendType]
        console.log(legendType)
        Object.assign(this.config.dataConfig.dbDataConfig, { legendType })
      },
      get () {
        return _.get(this, 'config.dataConfig.dbDataConfig.legendType', ['ci'])
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
