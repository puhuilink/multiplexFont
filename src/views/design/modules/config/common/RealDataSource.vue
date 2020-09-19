<template>
  <div class="RealDataSource">
    <a-form-item v-bind="formItemLayout">
      <a-button :loading="btnLoading" @click="preview">预览</a-button>
    </a-form-item>

    <a-form-item label="横轴类型" v-bind="formItemLayout" v-if="useXAxisType" >
      <a-select class="fw" v-model="xAxisType" @select="change">
        <a-select-option
          v-for="(option, idx) in xAxisTypeList"
          :key="idx"
          :value="option.value"
        >
          {{ option.label }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="图例内容" v-bind="formItemLayout" v-if="useLegendType" >
      <a-select
        class="fw"
        v-model="legendType"
        @change="change"
      >
        <a-select-option v-for="option in legendTypeList" :key="option.value">{{ option.label }}</a-select-option>
      </a-select>
    </a-form-item>

    <TimeRange v-if="useTimeRange" />

    <a-form-item label="计算类型" v-bind="formItemLayout" v-if="useRefreshTime" >
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

    <a-form-item label="分组" v-bind="formItemLayout" v-if="useRefreshTime" >
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

    <a-form-item label="监控类型" v-bind="formItemLayout" required>
      <DeviceTypeSelect
        class="fw"
        :value="resourceConfig.deviceType"
        @input="deviceType => {
          resourceConfig = {
            ...resourceConfig,
            ...{
              deviceType,
              deviceBrand: null,
              deviceModel: null,
              hostId: []
            }
          }
        }"
      />
    </a-form-item>

    <a-form-item label="品牌名称" v-bind="formItemLayout" required>
      <DeviceBrandSelect
        class="fw"
        :deviceType="resourceConfig.deviceType"
        :value="resourceConfig.deviceBrand"
        @input="deviceBrand => {
          resourceConfig = {
            ...resourceConfig,
            ...{
              deviceBrand,
              deviceModel: null,
              hostId: []
            }
          }
        }"
      />
    </a-form-item>

    <a-form-item label="品牌设备" v-bind="formItemLayout" required>
      <DeviceModelSelect
        class="fw"
        :deviceBrand="resourceConfig.deviceBrand"
        :value="resourceConfig.deviceModel"
        @input="deviceModel => {
          resourceConfig = {
            ...resourceConfig,
            ...{
              deviceModel,
              hostId: []
            }
          }
        }"
      />
    </a-form-item>

    <a-form-item label="设备名称" v-bind="formItemLayout" required>
      <HostSelect
        multiple
        class="fw"
        :hostType="resourceConfig.deviceModel"
        v-model="resourceConfig.hostId"
      />
    </a-form-item>

    <a-form-item label="监控实体" v-bind="formItemLayout" required >
      <EndpointSelect
        schema="model"
        v-bind="selectProps"
        :parentId="resourceConfig.deviceModel"
        v-model="resourceConfig.endpointModelId"
      />
    </a-form-item>

    <a-form-item label="检查项" v-bind="formItemLayout" required >
      <MetricSelect
        schema="model"
        multiple
        v-bind="selectProps"
        :parentId="resourceConfig.endpointModel"
        v-model="resourceConfig.metricModelIds"
      />
    </a-form-item>

    <a-form-item label="刷新时间" v-bind="formItemLayout" v-if="useRefreshTime" >
      <a-input
        :min="0"
        :parser="num => (Number(num) >= 0 ? Number(num) : 0).toFixed(0)"
        suffix="分钟"
        type="number"
        v-model.number="refreshTime"
      />
    </a-form-item>

    <a-form-item label="外部CI可用" v-bind="formItemLayout" v-if="useExternalCi" >
      <a-checkbox
        :checked="!!externalCi"
        @input="externalCi = $event"
      />
    </a-form-item>
  </div>
</template>

<script>
import DataSourceMixins from '../dataSourceMixins/index'
import TimeRange from './TimeRange'
import _ from 'lodash'
import { CmdbHostSelect } from '~~~/Resource/Cmdb/index'
// import { MetricService } from '@/api-hasura'
import DeviceTypeFactory from '~~~/Unknown/Device/DeviceType'
import DeviceBrandFactory from '~~~/Unknown/Device/DeviceBrand'
import DeviceModelFactory from '~~~/Unknown/Device/DeviceModel'
import HostFactory from '~~~/Unknown/Host'
import EndpointSelect from '~~~/Unknown/Endpoint'
import MetricSelect from '~~~/Unknown/Metric'

export default {
  name: 'RealDataSource',
  mixins: [DataSourceMixins],
  components: {
    TimeRange,
    DeviceTypeSelect: DeviceTypeFactory.create('select'),
    DeviceBrandSelect: DeviceBrandFactory.create('select'),
    DeviceModelSelect: DeviceModelFactory.create('select'),
    HostSelect: HostFactory.create('select'),
    CmdbHostSelect,
    EndpointSelect,
    MetricSelect
  },
  props: {
    comboSelectProps: {
      type: Object,
      default: () => ({})
    },
    multiple: {
      type: Boolean,
      default: false
    },
    toolTip: {
      type: Boolean,
      default: true
    },
    useComboSelect: {
      type: Boolean,
      default: true
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
      { label: '求和', value: 'total' },
      { label: '最大值', value: 'max' },
      { label: '均值', value: 'average' }
    ],
    groupList: [
      { label: '精确到分', value: 'minute' },
      { label: '精确到小时', value: 'hour' },
      { label: '精确到天', value: 'day' }
    ],
    legendTypeList: [
      { label: 'Ci', value: 'ci' },
      { label: 'Instance', value: 'instance' },
      { label: 'Kpi', value: 'kpi' }
    ],
    xAxisTypeList: [
      { name: '资源', value: 'RESOURCE' },
      { name: '时间', value: 'TIME' }
    ]
  }),
  computed: {
    legendType: {
      set (legendType) {
        // TODO: 此处先按单选实现，后期扩展为多选，始终以数组传递，方便向后兼容
        Object.assign(this.config.dataConfig.dbDataConfig, {
          legendType: _.castArray(legendType)
        })
      },
      get () {
        return _.get(this, 'config.dataConfig.dbDataConfig.legendType', ['ci'])
      }
    },
    selectProps () {
      const { toolTip, multiple } = this
      return { toolTip, multiple }
    }
  },
  methods: {
    async preview () {
      try {
        this.btnLoading = true
        // const result = await MetricService.chartValue({
        //   resourceConfig: {
        //     hostIds: [4329475],
        //     metricModels: [4329474],
        //     endpointModel: 4329473
        //   }
        // })
        // console.log(result)
        this.change(true)
      } catch (e) {
        throw e
      } finally {
        this.btnLoading = false
      }
    }
  }
}
</script>

<style lang="less">
.RealDataSource {
  .ant-select {
    width: 100%;
  }
}
</style>
