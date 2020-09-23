<template>
  <DataSourceTemplate>
    <template v-slot:SOURCE_TYPE_REAL>
      <RealDataSource
        useRefreshTime
        useTimeRange
      />
    </template>

    <template v-slot:SOURCE_TYPE_OVERVIEW>
      123
    </template>
  </DataSourceTemplate>
</template>

<script>
import DataSourceTemplate from './index'
import RealDataSource from '../common/RealDataSource'
import { SOURCE_TYPE_REAL, SOURCE_TYPE_OVERVIEW } from '@/model/config/dataConfig/dynamicData/types/sourceType'

export default {
  name: 'LinesDataSource',
  components: {
    DataSourceTemplate,
    RealDataSource
  },
  data: () => ({
    SOURCE_TYPE_REAL, SOURCE_TYPE_OVERVIEW
  })
}
</script>
