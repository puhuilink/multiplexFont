<template>
  <DataSourceTemplate>
    <template #real>
      <RealDataSource
        useComboSelect
        :comboSelectProps="{ multiple: true }"
        useLegendType
        useRefreshTime
        useTimeRange
        useXAxisType
      />
    </template>
  </DataSourceTemplate>
</template>

<script>
import DataSourceTemplate from './index'
import RealDataSource from '../common/RealDataSource'

export default {
  name: 'BarDataSource',
  components: {
    DataSourceTemplate,
    RealDataSource
  }
}
</script>
