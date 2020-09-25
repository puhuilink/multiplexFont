/**
* 告警列表动态数据配置
* Author: dong xing
* Date: 2020/4/7
* Time: 15:42
* Email: dong.xing@outlook.com
*/

<template>
  <div class="alarm-list-data-source">
    <DataSourceTemplate>
      <template v-slot:[SOURCE_TYPE_REAL]>
        <RealDataSource
          :key="SOURCE_TYPE_REAL"
          useComboSelect
          :useExternalCi="false"
          :comboSelectProps="{ multiple: true, hasDomain: true, hasAlarmType: true, hasKpi: false }"
        />
      </template>
    </DataSourceTemplate>
  </div>
</template>

<script>
import DataSourceTemplate from './index'
import DataSourceMixins from '../dataSourceMixins'
import RealDataSource from '../common/RealDataSource'
import { SOURCE_TYPE_REAL } from '@/model/config/dataConfig/dynamicData/types/sourceType'

export default {
  name: 'AlarmListDataSource',
  mixins: [DataSourceMixins],
  components: {
    DataSourceTemplate,
    RealDataSource
  },
  data: () => ({
    SOURCE_TYPE_REAL
  })
}
</script>

<style scoped lang="less">
.alarm-list-data-source {
  &__select {
     width: 100%;
   }
}
</style>
