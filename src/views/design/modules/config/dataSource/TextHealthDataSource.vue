<template>
  <DataSourceTemplate>
    <template v-slot:[SOURCE_TYPE_REAL]>
      <RealDataSource
        :key="SOURCE_TYPE_REAL"
        singleHost
        singleMetric
        :useCalculateType="false"
      />
    </template>

    <template v-slot:[SOURCE_TYPE_ALARM]>
      <AlarmDataSource
        :key="SOURCE_TYPE_ALARM"
      />
    </template>

    <template v-slot:[SOURCE_TYPE_OVERVIEW]>
      <OverviewDataSource
        :key="SOURCE_TYPE_OVERVIEW"
      />
    </template>
  </DataSourceTemplate>
</template>

<script>
import DataSourceTemplate from './index'
import DataSourceMixins from '../dataSourceMixins'
import RealDataSource from '../common/RealDataSource'
import AlarmDataSource from '../common/AlarmDataSource.vue'
import OverviewDataSource from '../common/OverviewDataSource'
import { SOURCE_TYPE_ALARM, SOURCE_TYPE_REAL, SOURCE_TYPE_OVERVIEW } from '@/model/config/dataConfig/dynamicData/types/sourceType'
export default {
  name: 'TextHealthDataSource',
  mixins: [DataSourceMixins],
  components: {
    DataSourceTemplate,
    RealDataSource,
    AlarmDataSource,
    OverviewDataSource
  },
  data: () => ({
    SOURCE_TYPE_ALARM,
    SOURCE_TYPE_REAL,
    SOURCE_TYPE_OVERVIEW
  })
}
</script>

<style scoped lang="less">
.data-source {
  &__select {
    width: 100%;
  }
}
</style>
