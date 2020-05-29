<template>
  <DataSourceTemplate>
    <template #real>
      <RealDataSource
        useComboSelect
        useTimeRange
        :comboSelectProps="{ multiple: false }"
      />
    </template>
  </DataSourceTemplate>
</template>

<script>
import DataSourceTemplate from './index'
import DataSourceMixins from '../dataSourceMixins'
import RealDataSource from '../common/RealDataSource'

export default {
  name: 'DegreeRingDataSource',
  mixins: [DataSourceMixins],
  components: {
    DataSourceTemplate,
    RealDataSource
  }
}
</script>

<style scoped lang="less">
.data-source {
  &__select {
    width: 100%;
  }
}
</style>
