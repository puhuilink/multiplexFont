<template>
  <a-form-model class="RealDataSource" v-bind="formItemLayout">
    <PreviewButton :validate="validate" :preview="() => change(true)" />

    <TimeRange v-if="useTimeRange" @change="change()" />

    <CalculateTypeSelect
      v-if="useCalculateType"
      @change="change()"
    />

    <GroupSelect @change="change()" />

    <a-form-item label="监控类型" required>
      <DeviceTypeSelect
        class="fw"
        :value="resourceConfig.deviceType"
        @input="deviceType => {
          changeDeviceType(deviceType)
          change()
        }"
      />
    </a-form-item>

    <a-form-item label="品牌名称" required>
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

    <a-form-item label="品牌设备" required>
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

    <a-form-item label="设备名称" required>
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

    <a-form-item label="监控实体" required >
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

    <a-form-item label="检查项" required >
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

    <a-form-item label="检查项(DH)">
      <AceEditor
        class="RealDataSource__editor"
        :code="JSON.stringify(resourceConfig.metricIds, null, '\t')"
        language="json"
        :style="{ height: '100px !important' }"
        @change="changeCmdbMetricIds"
      />
    </a-form-item>

    <a-form-item label="图例类型" v-show="useLegendType" required>
      <a-select
        v-model="resourceConfig.legendType"
        @change="change()"
      >
        <a-select-option value="host">设备</a-select-option>
        <a-select-option value="metric">指标</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="聚合方式" required>
      <a-select
        v-model="resourceConfig.endpointAggregateMode"
        @change="change()"
      >
        <a-select-option value="model">模型</a-select-option>
        <a-select-option value="cmdb">实例</a-select-option>
      </a-select>
    </a-form-item>

    <RefreshTime v-if="useRefreshTime" />

    <DelayTime />
  </a-form-model>
</template>

<script>
import _ from 'lodash'
import AceEditor from 'vue-ace-editor-valid'
import DataSourceMixins from '../dataSourceMixins/index'
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
    DeviceTypeSelect,
    DeviceBrandSelect,
    DeviceModelSelect,
    HostSelect,
    EndpointSelect,
    MetricSelect
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
    resourceConfig () {
      return this.config.dataConfig.dbDataConfig.resourceConfig
    }
  },
  methods: {
    /**
     * 校验数据配置
     */
    validate () {
      const {
        calculateType, isGroup, timeRangeConfig
      } = this.resourceConfig

      if (
        calculateType && (_.isEmpty(timeRangeConfig.getOption()) || !isGroup)
      ) {
        this.$message.error('选择计算类型时必须指定查询时间段与分组条件')
        return false
      }

      return true
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
