<template>
  <DataSourceTemplate>
    <template #real>
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

export default {
  name: 'GaugeDataSource',
  components: {
    DataSourceTemplate,
    RealDataSource
  }
}
</script>
