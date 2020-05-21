/**
* 极坐标数据资源
* Date: 2020/5/19
* Time: 12:15 下午
*/
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
  name: 'PolarDataSource',
  components: {
    DataSourceTemplate,
    RealDataSource
  }
}
</script>

<style scoped>

</style>
