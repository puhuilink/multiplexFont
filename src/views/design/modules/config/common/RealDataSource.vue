<template>
  <div class="RealDataSource">
    <a-form-item v-bind="formItemLayout">
      <a-button :loading="btnLoading" @click="preview">预览</a-button>
    </a-form-item>

    <a-form-item label="横轴类型" v-bind="formItemLayout" v-if="useXAxisType" >
      <a-select class="fw" v-model="xAxisType">
        <a-select-option
          v-for="(option, idx) in xAxisTypeList"
          :key="idx"
          :value="option.value"
        >
          {{ option.label }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <TimeRange v-if="useTimeRange" />

    <a-form-item label="计算类型" v-bind="formItemLayout" v-if="useCalculateType">
      <CalculateTypeSelect
        class="fw"
        v-model="resourceConfig.calculateType"
        @change="change()"
      />
    </a-form-item>

    <a-form-item label="分组条件" v-bind="formItemLayout" required v-if="useRefreshTime" v-show="resourceConfig.calculateType">
      <GroupSelect
        class="fw"
        v-model="resourceConfig.calculateType"
        @change="change()"
      />
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
              hostId: [],
              endpointModelId: null,
              metricModelIds: []
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
              hostId: [],
              endpointModelId: null,
              metricModelIds: []
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
              hostId: [],
              endpointModelId: null,
              metricModelIds: []
            }
          }
        }"
      />
    </a-form-item>

    <a-form-item label="设备名称" v-bind="formItemLayout" required>
      <HostSelect
        :multiple="!singleHost"
        class="fw"
        :hostTypeDictValueCode="resourceConfig.deviceModel"
        :value="resourceConfig.hostId"
        @input="hostId => {
          resourceConfig = {
            ...resourceConfig,
            hostId
          }
        }"
      />
    </a-form-item>

    <a-form-item label="监控实体" v-bind="formItemLayout" required >
      <EndpointSelect
        schema="model"
        :parentId="resourceConfig.deviceModel"
        :value="resourceConfig.endpointModelId"
        @input="endpointModelId => {
          resourceConfig = {
            ...resourceConfig,
            endpointModelId,
            metricModelIds: []
          }
        }"
      />
    </a-form-item>

    <a-form-item label="检查项" v-bind="formItemLayout" required >
      <MetricSelect
        schema="model"
        :multiple="!singleMetric"
        :parentId="resourceConfig.endpointModelId"
        :value="resourceConfig.metricModelIds"
        @input="metricModelIds => {
          resourceConfig = {
            ...resourceConfig,
            metricModelIds
          }
        }"
      />
    </a-form-item>

    <a-form-item label="刷新时间" v-bind="formItemLayout" v-if="useRefreshTime" >
      <a-input
        :min="0"
        :parser="num => (Number(num) >= 0 ? Number(num) : 0).toFixed(0)"
        suffix="分钟"
        type="number"
        v-model.number="resourceConfig.refreshTime"
        @input="change()"
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
/* eslint-disable standard/no-callback-literal */
import DataSourceMixins from '../dataSourceMixins/index'
import TimeRange from './TimeRange'
import _ from 'lodash'
import DeviceTypeFactory from '~~~/ResourceConfig/Device/DeviceType'
import DeviceBrandFactory from '~~~/ResourceConfig/Device/DeviceBrand'
import DeviceModelFactory from '~~~/ResourceConfig/Device/DeviceModel'
import HostFactory from '~~~/ResourceConfig/Host'
import EndpointSelect from '~~~/ResourceConfig/Endpoint'
import MetricSelect from '~~~/ResourceConfig/Metric'
import CalculateTypeSelect from './CalculateTypeSelect'
import GroupSelect from './GroupSelect'

export default {
  name: 'RealDataSource',
  mixins: [DataSourceMixins],
  components: {
    TimeRange,
    DeviceTypeSelect: DeviceTypeFactory.Select,
    DeviceBrandSelect: DeviceBrandFactory.Select,
    DeviceModelSelect: DeviceModelFactory.Select,
    HostSelect: HostFactory.Select,
    EndpointSelect,
    MetricSelect,
    CalculateTypeSelect,
    GroupSelect
  },
  props: {
    mode: {
      type: String,
      default: 'chart',
      validator: mode => ['chart', 'node'].includes(mode)
    },
    singleHost: {
      type: Boolean,
      default: false
    },
    // TODO: 多 metric 与多 host 增加了视图多绘制逻辑复杂度
    singleMetric: {
      type: Boolean,
      default: true
    },
    toolTip: {
      type: Boolean,
      default: true
    },
    useCalculateType: {
      type: Boolean,
      default: true
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
    legendTypeList: [
      { label: 'Ci', value: 'ci' },
      { label: 'Instance', value: 'instance' },
      { label: 'Kpi', value: 'kpi' }
    ],
    xAxisTypeList: [
      { label: '资源', value: 'RESOURCE' },
      { label: '时间', value: 'TIME' }
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
        return _.get(this.config, 'dataConfig.dbDataConfig.legendType', ['ci'])
      }
    }
  },
  methods: {
    async preview () {
      this.validate(async passValidate => {
        if (!passValidate) return
        try {
          this.btnLoading = true
          const timeRange = _.get(this, 'config.dataConfig.dbDataConfig.timeRangeConfig', {})
          const { calculateType, isGroup } = this.resourceConfig
          if (calculateType) {
            if (_.isEmpty(timeRange.getOption())) {
              this.$message.error('选择计算类型时必须指定查询时间段')
              return
            }
            if (!isGroup) {
              this.$message.error('选择计算类型时必须指定分组条件')
              return
            }
          }
          await this.change(true)
        } catch (e) {
          throw e
        } finally {
          this.btnLoading = false
        }
      })
    },
    validate (cb = () => {}) {
      const { resourceConfig } = this

      const timeRange = _.get(this, 'config.dataConfig.dbDataConfig.timeRangeConfig', {})
      const { calculateType, isGroup } = resourceConfig
      if (calculateType) {
        if (_.isEmpty(timeRange.getOption())) {
          this.$message.error('选择计算类型时必须指定查询时间段')
          cb(false)
          return
        }
        if (!isGroup) {
          this.$message.error('选择计算类型时必须指定分组条件')
          cb(false)
        }
      }

      // FIXME: 校验不准确
      // const fieldsMapping = new Map([
      //   ['deviceType', '监控类型'],
      //   ['deviceBrand', '品牌名称'],
      //   ['deviceModel', '品牌设备'],
      //   ['deviceModel', '设备名称'],
      //   ['endpointModelId', '监控实体'],
      //   ['endpointModelId', '监控实体'],
      //   ['metricModelIds', '检查项']
      // ])

      const passValidate = true

      // for (const field of [...fieldsMapping.keys()]) {
      //   const value = resourceConfig[field]
      //   if (!value || _.isEmpty(value)) {
      //     this.$message.error(`请选择${fieldsMapping.get(field)}`)
      //     passValidate = false
      //     break
      //   }
      // }

      cb(passValidate)
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
