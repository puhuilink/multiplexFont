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
    <template v-slot:[SOURCE_TYPE_NUMBER]>
      <NumberDataSource>
        :key="SOURCE_TYPE_NUMBER"
      </NumberDataSource>
    </template>
  </DataSourceTemplate>
</template>

<script>
import DataSourceTemplate from './index'
import RealDataSource from '../common/RealDataSource'
import ComboDataSource from '../common/ComboDataSource'
import AlarmDataSource from '../common/AlarmDataSource.vue'
import NumberDataSource from '../common/NumberDataSource'
import { SOURCE_TYPE_REAL, SOURCE_TYPE_ALARM, SOURCE_TYPE_COMBO, SOURCE_TYPE_NUMBER } from '@/model/config/dataConfig/dynamicData/types/sourceType'

export default {
  name: 'BarDataSource',
  components: {
    DataSourceTemplate,
    RealDataSource,
    AlarmDataSource,
    ComboDataSource,
    NumberDataSource
  },
  data: () => ({
    SOURCE_TYPE_REAL, SOURCE_TYPE_ALARM, SOURCE_TYPE_COMBO, SOURCE_TYPE_NUMBER
  })
}
</script>
