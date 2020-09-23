<template>
  <DataSourceTemplate>
    <template v-slot:SOURCE_TYPE_REAL>
      <RealDataSource
        singleHost
        singleMetric
        :useCalculateType="false"
      />
    </template>
  </DataSourceTemplate>
</template>

<script>
import DataSourceTemplate from './index'
import RealDataSource from '../common/RealDataSource'
import { SOURCE_TYPE_REAL } from '@/model/config/dataConfig/dynamicData/types/sourceType'

export default {
  name: 'GaugeDataSource',
  components: {
    DataSourceTemplate,
    RealDataSource
  },
  data: () => ({
    SOURCE_TYPE_REAL
  })
}
</script>
