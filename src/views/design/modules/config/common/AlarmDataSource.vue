<template>
  <div class="AlarmDataSource">
    <a-form-item v-bind="formItemLayout">
      <a-button :loading="btnLoading" @click="preview">预览</a-button>
    </a-form-item>

    <a-form-item label="数据域" v-bind="formItemLayout">
      <OriginSelect
        mode="multiple"
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

    <AlarmLevelSelect
      mode="multiple"
      v-bind="formItemLayout"
      v-model="alarmConfig.level"
      @change="event => {
        alarmConfig.level = event
        this.change()
      }"
    />

    <a-form-item label="告警状态" v-bind="formItemLayout" required>
      <a-select
        v-model="alarmConfig.type"
        @change="change()"
      >
        <a-select-option :value="ALARM_TYPE_ALL">全部告警</a-select-option>
        <a-select-option :value="ALARM_TYPE_UNCLOSE">未关闭告警</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="计算类型" v-bind="formItemLayout">
      <CalculateTypeSelect
        v-model="alarmConfig.calculateType"
        @change="change()"
      />
    </a-form-item>

    <!-- TODO: 只有当时间段不为实时时，才可按时间分组 -->
    <a-form-item label="分组条件" v-bind="formItemLayout" required>
      <GroupSelect
        :type="SOURCE_TYPE_ALARM"
        v-model="alarmConfig.isGroup"
        @change="change()"
      />
    </a-form-item>

    <TimeRange />

    <RefreshTime />
  </div>
</template>

<script>
import TimeRange from './TimeRange'
import DataSourceMixins from '../dataSourceMixins/index'
import RefreshTime from './RefreshTime'

import { OriginSelect } from '@/components/Alarm'
import { Select as DeviceTypeSelect } from '~~~/ResourceConfig/Device/DeviceType'
import CalculateTypeSelect from './CalculateTypeSelect'
import GroupSelect from './GroupSelect'
import { AlarmLevelSelect } from '~~~/Alarm'
import { SOURCE_TYPE_ALARM } from '@/model/config/dataConfig/dynamicData/types/sourceType'
import { ALARM_TYPE_ALL, ALARM_TYPE_UNCLOSE } from '@/model/config/dataConfig/dynamicData/types/alarmType'

export default {
  name: 'AlarmDataSource',
  mixins: [DataSourceMixins],
  components: {
    OriginSelect,
    DeviceTypeSelect,
    TimeRange,
    CalculateTypeSelect,
    GroupSelect,
    AlarmLevelSelect,
    RefreshTime
  },
  props: {},
  data: () => ({
    SOURCE_TYPE_ALARM,
    ALARM_TYPE_ALL,
    ALARM_TYPE_UNCLOSE
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
