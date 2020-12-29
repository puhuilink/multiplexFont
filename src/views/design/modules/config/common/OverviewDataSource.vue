<template>
  <div class="OverviewDataSource">
    <a-form-item v-bind="formItemLayout">
      <a-button :loading="btnLoading" @click="preview">预览</a-button>
    </a-form-item>

    <a-form-item label="数据域" v-bind="formItemLayout">
      <OriginSelect
        mode="multiple"
        v-model="overviewConfig.origin"
        @change="change()"
      />
    </a-form-item>

    <a-form-item label="设备" v-bind="formItemLayout">
      <a-select
        allowClear
        class="fw"
        mode="single"
        v-model="overviewConfig.hostAlias"
        @change="change()"
      >
        <a-select-option
          v-for="{ value, label } in hostAliasList"
          :value="value"
          :key="value"
        >{{ label }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="监控实体" v-bind="formItemLayout">
      <a-select
        allowClear
        class="fw"
        mode="single"
        v-model="overviewConfig.endpointAlias"
        @change="change()"
      >
        <a-select-option
          v-for="{ value, label } in endpointAliasList"
          :value="value"
          :key="value"
        >{{ label }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="检查项" v-bind="formItemLayout">
      <a-select
        allowClear
        class="fw"
        mode="multiple"
        v-model="overviewConfig.alias"
        @change="change()"
      >
        <a-select-option
          v-for="{ value, label } in metricAliasList"
          :value="value"
          :key="value"
        >{{ label }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="计算类型" v-bind="formItemLayout">
      <CalculateTypeSelect
        v-model="overviewConfig.calculateType"
        @change="change()"
      />
    </a-form-item>

    <a-form-item label="分组条件" v-bind="formItemLayout" required>
      <GroupSelect
        :type="SOURCE_TYPE_OVERVIEW"
        v-model="overviewConfig.isGroup"
        @change="change()"
      />
    </a-form-item>

    <TimeRange :type="SOURCE_TYPE_OVERVIEW" />

    <a-form-item label="刷新时间" v-bind="formItemLayout">
      <a-input
        :min="0"
        :parser="num => (Number(num) >= 0 ? Number(num) : 0).toFixed(0)"
        suffix="分钟"
        type="number"
        v-model.number="overviewConfig.refreshTime"
      />
    </a-form-item>
  </div>
</template>

<script>
/* eslint-disable standard/no-callback-literal */
import DataSourceMixins from '../dataSourceMixins/index'
import { OriginSelect } from '@/components/Alarm'
import TimeRange from './TimeRange'
import CalculateTypeSelect from './CalculateTypeSelect'
import GroupSelect from './GroupSelect'
import { SOURCE_TYPE_OVERVIEW } from '@/model/config/dataConfig/dynamicData/types/sourceType'
import _ from 'lodash'

export default {
  name: 'OverviewDataSource',
  mixins: [DataSourceMixins],
  components: {
    OriginSelect,
    TimeRange,
    CalculateTypeSelect,
    GroupSelect
  },
  props: {},
  data: () => ({
    SOURCE_TYPE_OVERVIEW,
    hostAliasList: [
      { label: '广域网路由器', value: '广域网路由器' },
      { label: '深信服设备AD', value: '深信服设备AD' },
      { label: '互联网负载均衡设备-1(10.1.1.31)', value: '互联网负载均衡设备-1(10.1.1.31)' },
      { label: '互联网负载均衡设备-2(10.1.1.32)', value: '互联网负载均衡设备-2(10.1.1.32)' }
    ],
    endpointAliasList: [
      { label: 'Gi2/2/0/1(link to HongKongZhongXin-CTE)', value: 'Gi2/2/0/1(link to HongKongZhongXin-CTE)' },
      { label: 'Gi2/2/0/8(link to BaLiZhongXin-CTE)', value: 'Gi2/2/0/8(link to BaLiZhongXin-CTE)' },
      { label: 'eth1', value: 'eth1' },
      { label: 'Vlan-4', value: 'Vlan-4' },
      { label: 'Gi2/2/0/1', value: 'Gi2/2/0/1' }
    ],
    metricAliasList: [
      { label: 'CPU总使用率', value: 'CPU总使用率' },
      { label: '内存使用率', value: '内存使用率' },
      { label: '下行流量', value: 'Input Rate' },
      { label: '上行流量', value: 'Output Rate' }
    ]
  }),
  computed: {},
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
      } = this.overviewConfig

      const timeRange = timeRangeConfig.getOption()

      if (
        (isGroup || calculateType) &&
        !_.isEmpty(timeRange)
      ) {
        this.$message.error('选中计算类型或分组时，必须选择查询时间')
        return cb(false)
      }

      if (isGroup && !calculateType) {
        this.$message.error('选中分组时，必须选择计算类型')
        return cb(false)
      }

      return cb(true)
    }
  }
}
</script>

<style lang="less">
.OverviewDataSource {
  .ant-select {
    width: 100%;
  }
}
</style>
