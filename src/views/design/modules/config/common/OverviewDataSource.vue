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

    <a-form-item label="检查项" v-bind="formItemLayout">
      <a-select
        class="fw"
        mode="multiple"
        v-model="overviewConfig.alias"
        @change="change()"
      >
        <a-select-option
          v-for="{ value, label } in aliasList"
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
import DataSourceMixins from '../dataSourceMixins/index'
import { OriginSelect } from '@/components/Alarm'
import TimeRange from './TimeRange'
import CalculateTypeSelect from './CalculateTypeSelect'
import GroupSelect from './GroupSelect'
import { SOURCE_TYPE_OVERVIEW } from '@/model/config/dataConfig/dynamicData/types/sourceType'

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
    aliasList: [
      { label: 'CPU总使用率', value: 'CPU总使用率' },
      { label: '内存使用率', value: '内存使用率' }
    ]
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
.OverviewDataSource {
  .ant-select {
    width: 100%;
  }
}
</style>
