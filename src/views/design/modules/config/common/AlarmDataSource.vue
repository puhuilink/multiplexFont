<template>
  <a-form-model class="AlarmDataSource" v-bind="formItemLayout">
    <PreviewButton :preview="preview" />

    <a-form-item label="数据域">
      <OriginSelect
        mode="multiple"
        v-model="alarmConfig.origin"
        @change="change()"
      />
    </a-form-item>

    <a-form-item label="监控类型" required>
      <DeviceTypeSelect
        multiple
        :value="alarmConfig.deviceType"
        @input="deviceType => {
          alarmConfig = {
            ...alarmConfig,
            ...{
              deviceType,
              hostId: null
            }
          }
        }"
        class="fw"
      />
    </a-form-item>

    <a-form-item label="设备ID" v-bind="formItemLayout" required>
      <a-input
        :value="alarmConfig.hostId"
        @input="e => {
          alarmConfig = {
            ...alarmConfig,
            ...{
              hostId: e.target.value
            }
          }
        }"
        class="fw"
      />
    </a-form-item>

    <AlarmLevelSelect
      mode="multiple"

      v-model="alarmConfig.level"
      @change="event => {
        alarmConfig.level = event
        this.change()
      }"
    />

    <a-form-item label="告警状态" required>
      <a-select
        v-model="alarmConfig.type"
        @change="change()"
      >
        <a-select-option :value="ALARM_TYPE_ALL">全部告警</a-select-option>
        <a-select-option :value="ALARM_TYPE_UNCLOSE">未关闭告警</a-select-option>
      </a-select>
    </a-form-item>

    <CalculateTypeSelect @change="change()" />

    <!-- TODO: 只有当时间段不为实时时，才可按时间分组 -->
    <GroupSelect @change="change()" />

    <TimeRange @change="change()" />

    <RefreshTime @change="change()" />
  </a-form-model>
</template>

<script>
import DataSourceMixins from '../dataSourceMixins/index'
import { OriginSelect } from '@/components/Alarm'
import { Select as DeviceTypeSelect } from '~~~/ResourceConfig/Device/DeviceType'
import { AlarmLevelSelect } from '~~~/Alarm'
import { SOURCE_TYPE_ALARM } from '@/model/config/dataConfig/dynamicData/types/sourceType'
import { ALARM_TYPE_ALL, ALARM_TYPE_UNCLOSE } from '@/model/config/dataConfig/dynamicData/types/alarmType'

export default {
  name: 'AlarmDataSource',
  mixins: [DataSourceMixins],
  components: {
    OriginSelect,
    DeviceTypeSelect,
    AlarmLevelSelect
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
