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
      { label: '广域网路由器', value: '广域网路由器' }
    ],
    endpointAliasList: [
      { label: 'Gi2/2/0/1(link to HongKongZhongXin-CTE)', value: 'Gi2/2/0/1(link to HongKongZhongXin-CTE)' },
      { label: 'Gi2/2/0/8(link to BaLiZhongXin-CTE)', value: 'Gi2/2/0/8(link to BaLiZhongXin-CTE)' }
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
        [1, 2].includes(
          Number(!!calculateType) +
          Number(!!isGroup) +
          Number(!_.isEmpty(timeRange))
        )
      ) {
        this.$message.error('计算类型、分组条件、查询时间必须全选或全不选')
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
