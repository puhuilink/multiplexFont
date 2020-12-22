<template>
  <DataSourceTemplate>
    <template v-slot:[SOURCE_TYPE_REAL]>
      <RealDataSource
        :key="SOURCE_TYPE_REAL"
        useComboSelect
        useLegendType
        useTimeRange
        multipleHost
        multipleMetric
        :comboSelectProps="{ multiple: false }"
      />
    </template>

    <!-- <template v-slot:[SOURCE_TYPE_OVERVIEW]>
      <OverviewDataSource
        :key="SOURCE_TYPE_OVERVIEW"
      />
    </template> -->
  </DataSourceTemplate>
</template>

<script>
import DataSourceTemplate from './index'
import DataSourceMixins from '../dataSourceMixins'
import RealDataSource from '../common/RealDataSource'
import OverviewDataSource from '../common/OverviewDataSource'
import { SOURCE_TYPE_REAL, SOURCE_TYPE_OVERVIEW } from '@/model/config/dataConfig/dynamicData/types/sourceType'

export default {
  name: 'ListDataSource',
  mixins: [DataSourceMixins],
  components: {
    DataSourceTemplate,
    RealDataSource,
    OverviewDataSource
  },
  data: () => ({
    SOURCE_TYPE_REAL,
    SOURCE_TYPE_OVERVIEW
  })
}
</script>

<style scoped lang="less">
</style>
