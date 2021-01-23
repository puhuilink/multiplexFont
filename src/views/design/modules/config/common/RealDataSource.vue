<template>
  <div class="RealDataSource">
    <a-form-item v-bind="formItemLayout">
      <a-button :loading="btnLoading" @click="preview">预览</a-button>
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
        v-model="resourceConfig.isGroup"
        @change="change()"
      />
    </a-form-item>

    <a-form-item label="监控类型" v-bind="formItemLayout" required>
      <DeviceTypeSelect
        class="fw"
        :value="resourceConfig.deviceType"
        @input="deviceType => {
          changeDeviceType(deviceType)
          change()
        }"
      />
    </a-form-item>

    <a-form-item label="品牌名称" v-bind="formItemLayout" required>
      <DeviceBrandSelect
        class="fw"
        :deviceType="resourceConfig.deviceType"
        :value="resourceConfig.deviceBrand"
        @input="deviceBrand => {
          changeDeviceBrand(deviceBrand)
          change()
        }"
      />
    </a-form-item>

    <a-form-item label="品牌设备" v-bind="formItemLayout" required>
      <DeviceModelSelect
        class="fw"
        :deviceBrand="resourceConfig.deviceBrand"
        :value="resourceConfig.deviceModel"
        @input="deviceModel => {
          changeDeviceModel(deviceModel)
          change()
        }"
      />
    </a-form-item>

    <a-form-item label="设备名称" v-bind="formItemLayout" required>
      <HostSelect
        class="fw"
        :multiple="multipleHost || (!singleHost && resourceConfig.metricModelIds.length <= 1)"
        :hostTypeDictValueCode="resourceConfig.deviceModel"
        :value="resourceConfig.hostId"
        @input="hostId => {
          changeHost(hostId)
          change()
        }"
      />
    </a-form-item>

    <a-form-item label="监控实体" v-bind="formItemLayout" required >
      <EndpointSelect
        :parentId="resourceConfig.deviceModel"
        schema="model"
        :value="resourceConfig.endpointModelId"
        @input="endpointModelId => {
          changeEndpoint(endpointModelId)
          change()
        }"
      />
    </a-form-item>

    <a-form-item label="检查项" v-bind="formItemLayout" required >
      <MetricSelect
        :multiple="multipleMetric || (!singleMetric && resourceConfig.hostId.length <= 1)"
        schema="model"
        :parentId="resourceConfig.endpointModelId"
        :value="resourceConfig.metricModelIds"
        @input="metricModelIds => {
          changeMetric(metricModelIds)
          change()
        }"
      />
    </a-form-item>

    <a-form-item label="检查项(DH)" v-bind="formItemLayout">
      <AceEditor
        class="RealDataSource__editor"
        :code="JSON.stringify(resourceConfig.metricIds, null, '\t')"
        language="json"
        :style="{ height: '100px !important' }"
        @change="changeCmdbMetricIds"
      />
    </a-form-item>

    <a-form-item label="图例类型" v-show="useLegendType" v-bind="formItemLayout" required>
      <a-select
        v-model="resourceConfig.legendType"
        @change="change()"
      >
        <a-select-option value="host">设备</a-select-option>
        <a-select-option value="metric">指标</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="聚合方式" v-bind="formItemLayout" required>
      <a-select
        v-model="resourceConfig.endpointAggregateMode"
        @change="change()"
      >
        <a-select-option value="model">模型</a-select-option>
        <a-select-option value="cmdb">实例</a-select-option>
      </a-select>
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

    <a-form-item label="延迟时间" v-bind="formItemLayout" v-if="useRefreshTime" >
      <a-input
        :min="0"
        :parser="num => (Number(num) >= 0 ? Number(num) : 0).toFixed(0)"
        suffix="毫秒"
        type="number"
        v-model.number="resourceConfig.delayTime"
        @input="change()"
      />
    </a-form-item>
  </div>
</template>

<script>
/* eslint-disable standard/no-callback-literal */
import _ from 'lodash'
import AceEditor from 'vue-ace-editor-valid'
import DataSourceMixins from '../dataSourceMixins/index'

import TimeRange from './TimeRange'
import CalculateTypeSelect from './CalculateTypeSelect'
import GroupSelect from './GroupSelect'

import { Select as DeviceTypeSelect } from '~~~/ResourceConfig/Device/DeviceType'
import { Select as DeviceBrandSelect } from '~~~/ResourceConfig/Device/DeviceBrand'
import { Select as DeviceModelSelect } from '~~~/ResourceConfig/Device/DeviceModel'
import { Select as HostSelect } from '~~~/ResourceConfig/Host'
import EndpointSelect from '~~~/ResourceConfig/Endpoint'
import MetricSelect from '~~~/ResourceConfig/Metric'

export default {
  name: 'RealDataSource',
  mixins: [DataSourceMixins],
  components: {
    AceEditor,
    TimeRange,
    DeviceTypeSelect,
    DeviceBrandSelect,
    DeviceModelSelect,
    HostSelect,
    EndpointSelect,
    MetricSelect,
    CalculateTypeSelect,
    GroupSelect
  },
  props: {
    singleHost: {
      type: Boolean,
      default: false
    },
    singleMetric: {
      type: Boolean,
      default: false
    },
    // TODO: 此处为 hack
    multipleMetric: {
      type: Boolean,
      default: false
    },
    // TODO: 此处为 hack
    multipleHost: {
      type: Boolean,
      default: false
    },
    useCalculateType: {
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
    }
  },
  data: () => ({}),
  computed: {
    dbDataConfig () {
      return this.config.dataConfig.dbDataConfig
    },
    resourceConfig () {
      return this.config.dataConfig.dbDataConfig.resourceConfig
    }
  },
  methods: {
    /**
     * 预览数据
     */
    async preview () {
      this.validate(async passValidate => {
        if (!passValidate) return
        try {
          this.btnLoading = true
          await this.change(true)
        } finally {
          this.btnLoading = false
        }
      })
    },
    /**
     * 校验数据配置
     */
    validate (cb = (passValidate) => {}) {
      const {
        calculateType, isGroup, timeRangeConfig
      } = this.resourceConfig

      if (
        calculateType && (_.isEmpty(timeRangeConfig.getOption()) || !isGroup)
      ) {
        this.$message.error('选择计算类型时必须指定查询时间段与分组条件')
        return cb(false)
      }

      return cb(true)
    },
    /**
     * 设置监控类型
     */
    changeDeviceType (deviceType) {
      Object.assign(
        this.resourceConfig,
        { deviceType }
      )
      this.changeDeviceBrand(null)
    },
    /**
     * 设置品牌名称
     */
    changeDeviceBrand (deviceBrand) {
      Object.assign(
        this.resourceConfig,
        { deviceBrand }
      )
      this.changeDeviceModel(null)
    },
    /**
     * 设置品牌设备
     */
    changeDeviceModel (deviceModel) {
      Object.assign(
        this.resourceConfig,
        { deviceModel }
      )
      this.changeHost([])
      this.changeEndpoint(null)
    },
    /**
     * 设置设备名称
     */
    changeHost (hostId) {
      Object.assign(
        this.resourceConfig,
        { hostId: _.castArray(hostId) }
      )
    },
    /**
     * 设置监控实体
     */
    changeEndpoint (endpointModelId) {
      Object.assign(
        this.resourceConfig,
        { endpointModelId }
      )
      this.changeMetric([])
    },
    /**
     * 设置检查项
     */
    changeMetric (metricModelIds) {
      Object.assign(
        this.resourceConfig,
        { metricModelIds: _.castArray(metricModelIds) }
      )
      this.changeCmdbMetricIds('[]')
    },
    changeCmdbMetricIds (code) {
      if (code) {
        Object.assign(
          this.resourceConfig,
          { metricIds: JSON.parse(code) }
        )
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

  &__editor {
    height: 100px !important;
    border-radius: 4px;
    background: #f1f1f1;
    font-size: 14px;
  }
}
</style>
