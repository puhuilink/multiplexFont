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
import DataSourceMixins from '../dataSourceMixins'
import RealDataSource from '../common/RealDataSource'
import { SOURCE_TYPE_REAL } from '@/model/config/dataConfig/dynamicData/types/sourceType'

export default {
  name: 'DegreeRingDataSource',
  mixins: [DataSourceMixins],
  components: {
    DataSourceTemplate,
    RealDataSource
  },
  data: () => ({
    SOURCE_TYPE_REAL
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
