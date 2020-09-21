<template>
  <DataSourceTemplate>
    <template #real>
      <RealDataSource
        useRefreshTime
        :useCalculateType="false"
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
