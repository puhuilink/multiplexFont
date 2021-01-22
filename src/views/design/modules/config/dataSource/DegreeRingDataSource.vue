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
import ComboDataSource from '../common/ComboDataSource'
import { SOURCE_TYPE_REAL, SOURCE_TYPE_COMBO } from '@/model/config/dataConfig/dynamicData/types/sourceType'

export default {
  name: 'DegreeRingDataSource',
  mixins: [DataSourceMixins],
  components: {
    DataSourceTemplate,
    RealDataSource,
    ComboDataSource
  },
  data: () => ({
    SOURCE_TYPE_REAL,
    SOURCE_TYPE_COMBO
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
