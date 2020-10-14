<template>
  <DataSourceTemplate>
    <template #real>
      <RealDataSource
        singleHost
        singleMetric
        :useCalculateType="false"
      />
    </template>
    <template #alarm>
      <AlarmDataSource />
    </template>
  </DataSourceTemplate>
</template>

<script>
import DataSourceTemplate from './index'
import DataSourceMixins from '../dataSourceMixins'
import RealDataSource from '../common/RealDataSource'
import AlarmDataSource from '../common/AlarmDataSource.vue'

export default {
  name: 'TextHealthDataSource',
  mixins: [DataSourceMixins],
  components: {
    DataSourceTemplate,
    RealDataSource,
    AlarmDataSource
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
