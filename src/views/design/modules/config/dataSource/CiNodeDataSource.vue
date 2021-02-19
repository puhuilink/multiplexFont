<template>
  <div class="CiNodeDataSource">
    <a-collapse defaultActiveKey="1" :bordered="false">
      <a-collapse-panel header="数据源" key="1">

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
            v-bind="selectProps"
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
            multiple
            v-bind="selectProps"
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

        <a-form-item label="检查项(DH)" v-bind="formItemLayout">
          <AceEditor
            class="CiNodeDataSource__editor"
            :code="JSON.stringify(resourceConfig.metricIds, null, '\t')"
            language="json"
            :style="{ height: '100px !important' }"
            @change="metricIds => {
              if (metricIds) {
                resourceConfig = {
                  ...resourceConfig,
                  metricIds: JSON.parse(metricIds)
                }
              }
            }"
          />
        </a-form-item>
      </a-collapse-panel>
    </a-collapse>

  </div>
</template>

<script>
// TODO: 与 dataSourceMixin 抽离公共部分
import _ from 'lodash'
import AceEditor from 'vue-ace-editor-valid'

import NodeMixin from '../dataSourceMixins/nodes'

import { Select as DeviceTypeSelect } from '~~~/ResourceConfig/Device/DeviceType'
import { Select as DeviceBrandSelect } from '~~~/ResourceConfig/Device/DeviceBrand'
import { Select as DeviceModelSelect } from '~~~/ResourceConfig/Device/DeviceModel'
import { Select as HostSelect } from '~~~/ResourceConfig/Host'
import EndpointSelect from '~~~/ResourceConfig/Endpoint'
import MetricSelect from '~~~/ResourceConfig/Metric'

export default {
  name: 'CiNodeDataSource',
  mixins: [NodeMixin],
  components: {
    AceEditor,
    DeviceTypeSelect,
    DeviceBrandSelect,
    DeviceModelSelect,
    HostSelect,
    EndpointSelect,
    MetricSelect
  },
  props: {},
  data: () => ({
    btnLoading: false,
    formItemLayout: {
      labelCol: {
        span: 6,
        offset: 0
      },
      wrapperCol: {
        span: 15,
        offset: 2
      }
    },
    selectProps: {}
  }),
  computed: {
    resourceConfig: {
      get () {
        // return this.model.resourceConfig
        return _.get(this.model, 'resourceConfig', {})
      },
      set (v) {
        Object.assign(this.model.resourceConfig, v)
        this.change()
      }
    }
  }
}
</script>

<style lang="less">
.CiNodeDataSource {
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
