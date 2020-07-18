<template>
  <DataSourceTemplate>
    <template #real>
      <RealDataSource
        useComboSelect
        :comboSelectProps="{ multiple: false }"
        useRefreshTime
        useTimeRange
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
