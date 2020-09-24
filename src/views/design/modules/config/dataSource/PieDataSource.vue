<template>
  <DataSourceTemplate>
    <template v-slot:[SOURCE_TYPE_REAL]>
      <RealDataSource
        :key="SOURCE_TYPE_REAL"
        useComboSelect
        :comboSelectProps="{ multiple: true }"
        useRefreshTime
        useTimeRange
      />
    </template>
  </DataSourceTemplate>
</template>

<script>
import DataSourceTemplate from './index'
import RealDataSource from '../common/RealDataSource'
import { SOURCE_TYPE_REAL } from '@/model/config/dataConfig/dynamicData/types/sourceType'

export default {
  name: 'PieDataSource',
  components: {
    DataSourceTemplate,
    RealDataSource
  },
  data: () => ({
    SOURCE_TYPE_REAL
  })
}
</script>
