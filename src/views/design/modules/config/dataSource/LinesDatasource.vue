<template>
  <DataSourceTemplate>
    <template v-slot:[SOURCE_TYPE_REAL]>
      <RealDataSource
        :key="SOURCE_TYPE_REAL"
        multipleHost
        multipleMetric
        useRefreshTime
        useTimeRange
      />
    </template>

    <template v-slot:[SOURCE_TYPE_OVERVIEW]>
      <OverviewDataSource
        :key="SOURCE_TYPE_OVERVIEW"
      />
    </template>

    <template v-slot:[SOURCE_TYPE_COMBO]>
      <ComboDataSource
        :key="SOURCE_TYPE_COMBO"
      />
    </template>
  </DataSourceTemplate>
</template>

<script>
import DataSourceTemplate from './index'
import RealDataSource from '../common/RealDataSource'
import OverviewDataSource from '../common/OverviewDataSource'
import ComboDataSource from '../common/ComboDataSource'
import { SOURCE_TYPE_REAL, SOURCE_TYPE_OVERVIEW, SOURCE_TYPE_COMBO } from '@/model/config/dataConfig/dynamicData/types/sourceType'

export default {
  name: 'LinesDataSource',
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
