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
    <template v-slot:[SOURCE_TYPE_COMBO]>
      <ComboDataSource
        :key="SOURCE_TYPE_COMBO"
      />
    </template>
  </DataSourceTemplate>
</template>

<script>
import DataSourceTemplate from './index'
import DataSourceMixins from '../dataSourceMixins'
import RealDataSource from '../common/RealDataSource'
import OverviewDataSource from '../common/OverviewDataSource'
import { SOURCE_TYPE_REAL, SOURCE_TYPE_OVERVIEW, SOURCE_TYPE_COMBO } from '@/model/config/dataConfig/dynamicData/types/sourceType'
import ComboDataSource from '../common/ComboDataSource'

export default {
  name: 'ListDataSource',
  mixins: [DataSourceMixins],
  components: {
    DataSourceTemplate,
    RealDataSource,
    OverviewDataSource,
    ComboDataSource

  },
  data: () => ({
    SOURCE_TYPE_REAL,
    SOURCE_TYPE_OVERVIEW,
    SOURCE_TYPE_COMBO
  })
}
</script>

<style scoped lang="less">
</style>
