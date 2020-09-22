<template>
  <div class="AlarmDataSource">
    <a-form-item v-bind="formItemLayout">
      <a-button :loading="btnLoading" @click="preview">预览</a-button>
    </a-form-item>

    <a-form-item label="数据域" v-bind="formItemLayout">
      <OriginSelect
        v-model="alarmConfig.origin"
        @change="change()"
      />
    </a-form-item>

    <a-form-item label="监控类型" v-bind="formItemLayout" required>
      <DeviceTypeSelect
        multiple
        :value="alarmConfig.deviceType"
        @input="deviceType => {
          alarmConfig = {
            ...alarmConfig,
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
        class="fw"
      />
    </a-form-item>

    <a-form-item label="计算类型" v-bind="formItemLayout">
      <CalculateTypeSelect
        v-model="alarmConfig.calculateType"
        @change="change()"
      />
    </a-form-item>

    <a-form-item label="分组条件" v-bind="formItemLayout" required>
      <GroupSelect
        :type="SOURCE_TYPE_ALARM"
        v-model="alarmConfig.isGroup"
        @change="change()"
      />
    </a-form-item>

    <TimeRange :type="SOURCE_TYPE_ALARM" />
  </div>
</template>

<script>
import { OriginSelect } from '@/components/Alarm'
import DataSourceMixins from '../dataSourceMixins/index'
import DeviceTypeFactory from '~~~/Unknown/Device/DeviceType'
import TimeRange from './TimeRange'
import { SOURCE_TYPE_ALARM } from '@/model/config/dataConfig/dynamicData/types/sourceType'
import CalculateTypeSelect from './CalculateTypeSelect'
import GroupSelect from './GroupSelect'

export default {
  name: 'AlarmDataSource',
  mixins: [DataSourceMixins],
  components: {
    OriginSelect,
    DeviceTypeSelect: DeviceTypeFactory.Select,
    TimeRange,
    CalculateTypeSelect,
    GroupSelect
  },
  props: {},
  data: () => ({
    SOURCE_TYPE_ALARM
  }),
  computed: {},
  methods: {
    async preview () {
      try {
        this.btnLoading = true
        await this.change(true)
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
.AlarmDataSource {
  .ant-select {
    width: 100%;
  }
}
</style>
