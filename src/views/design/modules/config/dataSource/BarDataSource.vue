<template>
  <DataSourceTemplate>
    <template #real>
      <RealDataSource
        useRefreshTime
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
import RealDataSource from '../common/RealDataSource'
import AlarmDataSource from '../common/AlarmDataSource.vue'

export default {
  name: 'BarDataSource',
  components: {
    DataSourceTemplate,
    RealDataSource,
    AlarmDataSource
  }
}
</script>
