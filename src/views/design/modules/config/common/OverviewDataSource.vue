<template>
  <div class="OverviewDataSource">
    <a-form-item label="数据域" v-bind="formItemLayout">
      <OriginSelect
        mode="multiple"
        v-model="overviewConfig.origin"
        @change="change()"
      />
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
    SOURCE_TYPE_OVERVIEW
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">
.OverviewDataSource {
  .ant-select {
    width: 100%;
  }
}
</style>
