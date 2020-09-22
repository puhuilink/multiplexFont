/**
* 极坐标数据资源
* Date: 2020/5/19
* Time: 12:15 下午
*/
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
  name: 'PolarDataSource',
  components: {
    DataSourceTemplate,
    RealDataSource,
    AlarmDataSource
  }
}
</script>

<style scoped>

</style>
