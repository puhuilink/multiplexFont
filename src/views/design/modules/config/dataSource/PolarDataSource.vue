/**
* 极坐标数据资源
* Date: 2020/5/19
* Time: 12:15 下午
*/
<template>
  <DataSourceTemplate>
    <template v-slot:[SOURCE_TYPE_REAL]>
      <RealDataSource
        :key="SOURCE_TYPE_REAL"
        useRefreshTime
        :useCalculateType="false"
      />
    </template>
    <template v-slot:[SOURCE_TYPE_ALARM]>
      <AlarmDataSource
        :key="SOURCE_TYPE_ALARM"
      />
    </template>
  </DataSourceTemplate>
</template>

<script>
import DataSourceTemplate from './index'
import RealDataSource from '../common/RealDataSource'
import AlarmDataSource from '../common/AlarmDataSource.vue'
import { SOURCE_TYPE_REAL, SOURCE_TYPE_ALARM } from '@/model/config/dataConfig/dynamicData/types/sourceType'

export default {
  name: 'PolarDataSource',
  components: {
    DataSourceTemplate,
    RealDataSource,
    AlarmDataSource
  },
  data: () => ({ SOURCE_TYPE_REAL, SOURCE_TYPE_ALARM })
}
</script>

<style scoped>

</style>
