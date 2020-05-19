<template>
  <DataSourceTemplate>
    <template #real>
      <RealDataSource
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

export default {
  name: 'LinesDataSource',
  components: {
    DataSourceTemplate,
    RealDataSource
  }
}
</script>
