<template>
  <a-form-model class="OverviewDataSource" v-bind="formItemLayout">
    <PreviewButton :validate="validate" :preview="() => change(true)" />

    <a-form-item label="数据域">
      <OriginSelect
        mode="multiple"
        v-model="overviewConfig.origin"
        @change="change()"
      />
    </a-form-item>

    <a-form-item label="设备">
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

    <a-form-item label="监控实体">
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

    <a-form-item label="检查项">
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

    <CalculateTypeSelect @change="change()" />

    <GroupSelect @change="change()" />

    <TimeRange @change="change()" />

    <RefreshTime @change="change()" />
  </a-form-model>
</template>

<script>
import _ from 'lodash'
import DataSourceMixins from '../dataSourceMixins/index'
import { OriginSelect } from '@/components/Alarm'

export default {
  name: 'OverviewDataSource',
  mixins: [DataSourceMixins],
  components: {
    OriginSelect
  },
  props: {},
  data: () => ({
    hostAliasList: [
      { label: '广域网路由器', value: '广域网路由器' },
      { label: '深信服设备AD', value: '深信服设备AD' },
      { label: '互联网负载均衡设备-1(10.1.1.31)', value: '互联网负载均衡设备-1(10.1.1.31)' },
      { label: '互联网负载均衡设备-2(10.1.1.32)', value: '互联网负载均衡设备-2(10.1.1.32)' }
    ],
    endpointAliasList: [
      { label: '端口组.Gi2/2/0/1(link to HongKongZhongXin-CTE)', value: '端口组.Gi2/2/0/1(link to HongKongZhongXin-CTE)' },
      { label: '端口组.Gi2/2/0/8(link to BaLiZhongXin-CTE)', value: '端口组.Gi2/2/0/8(link to BaLiZhongXin-CTE)' },
      { label: 'eth1', value: 'eth1' },
      { label: 'Vlan-4', value: 'Vlan-4' },
      { label: 'Gi2/2/0/1', value: 'Gi2/2/0/1' }
    ],
    metricAliasList: [
      { label: 'CPU总使用率', value: 'CPU总使用率' },
      { label: '内存使用率', value: '内存使用率' },
      { label: '下行流量', value: '输入流量' },
      { label: '上行流量', value: '输出流量' }
    ]
  }),
  computed: {},
  methods: {
    /**
     * 校验数据配置
     */
    validate () {
      const {
        calculateType, isGroup, timeRangeConfig
      } = this.overviewConfig

      const timeRange = timeRangeConfig.getOption()

      if (
        (isGroup || calculateType) &&
        _.isEmpty(timeRange)
      ) {
        this.$message.error('选中计算类型或分组时，必须选择查询时间')
        return false
      }

      if (isGroup && !calculateType) {
        this.$message.error('选中分组时，必须选择计算类型')
        return false
      }

      return true
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
