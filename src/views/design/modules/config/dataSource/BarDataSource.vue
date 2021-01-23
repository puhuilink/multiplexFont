<template>
  <DataSourceTemplate>
    <template v-slot:[SOURCE_TYPE_REAL]>
      <RealDataSource
        :key="SOURCE_TYPE_REAL"
        multipleHost
        multipleMetric
        useRefreshTime
        :useCalculateType="false"
      />
    </template>
    <template v-slot:[SOURCE_TYPE_ALARM]>
      <AlarmDataSource
        :key="SOURCE_TYPE_ALARM"
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
import ComboDataSource from '../common/ComboDataSource'
import AlarmDataSource from '../common/AlarmDataSource.vue'
import { SOURCE_TYPE_REAL, SOURCE_TYPE_ALARM, SOURCE_TYPE_COMBO } from '@/model/config/dataConfig/dynamicData/types/sourceType'

export default {
  name: 'BarDataSource',
  components: {
    DataSourceTemplate,
    RealDataSource,
    AlarmDataSource,
    ComboDataSource
  },
  data: () => ({
    SOURCE_TYPE_REAL, SOURCE_TYPE_ALARM, SOURCE_TYPE_COMBO
  })
}
</script>
