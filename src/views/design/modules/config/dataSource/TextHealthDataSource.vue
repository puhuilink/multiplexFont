<template>
  <DataSourceTemplate>
    <template v-slot:[SOURCE_TYPE_REAL]>
      <RealDataSource
        :key="SOURCE_TYPE_REAL"
        singleHost
        singleMetric
        useTimeRange
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
    <template v-slot:[SOURCE_TYPE_COMBO]>
      <ComboDataSource
        :key="SOURCE_TYPE_COMBO"
      />
    </template>
    <template v-slot:[SOURCE_TYPE_DH]>
      <DHDataSource
        :key="SOURCE_TYPE_DH"
      />
    </template>
    <template v-slot:[SOURCE_TYPE_SQL]>
      <SQLDataSource
        :key="SOURCE_TYPE_SQL"
      />
    </template>
    <template v-slot:[SOURCE_TYPE_OPEN]>
      <OpenDataSource
        :key="SOURCE_TYPE_OPEN"
        :useCalculateType="false"
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
import ComboDataSource from '../common/ComboDataSource'
import DHDataSource from '../common/DHDataSource'
import SQLDataSource from '../common/SQLDataSource'
import {
  SOURCE_TYPE_ALARM,
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_OVERVIEW,
  SOURCE_TYPE_COMBO,
  SOURCE_TYPE_DH,
  SOURCE_TYPE_SQL, SOURCE_TYPE_OPEN
} from '@/model/config/dataConfig/dynamicData/types/sourceType'
import OpenDataSource from '@/views/design/modules/config/common/OpenDataSource'

export default {
  name: 'TextHealthDataSource',
  mixins: [DataSourceMixins],
  components: {
    DataSourceTemplate,
    RealDataSource,
    AlarmDataSource,
    OverviewDataSource,
    ComboDataSource,
    DHDataSource,
    OpenDataSource,
    SQLDataSource
  },
  data: () => ({
    SOURCE_TYPE_ALARM,
    SOURCE_TYPE_REAL,
    SOURCE_TYPE_OVERVIEW,
    SOURCE_TYPE_COMBO,
    SOURCE_TYPE_DH,
    SOURCE_TYPE_OPEN,
    SOURCE_TYPE_SQL
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
