<template>
  <DataSourceTemplate>
    <template #real>
      <!-- <a-tooltip placement="top" title="加载假数据" arrowPointAtCenter>
        <a-button>模拟</a-button>
      </a-tooltip> -->
      <a-tooltip placement="top" title="加载真实数据" arrowPointAtCenter>
        <a-button :disabled="!available" @click="change(true)">预览</a-button>
      </a-tooltip>

      <ComboSelect :multiple="false" v-model="resourceConfig" />

    </template>
  </DataSourceTemplate>
</template>

<script>
import { ComboSelect } from '@/components/Common'
import DataSourceTemplate from './index'
import DataSourceMixins from '../dataSourceMixins'

export default {
  name: 'GaugeDataSource',
  mixins: [DataSourceMixins],
  components: {
    DataSourceTemplate,
    ComboSelect
  }
}
</script>

<style scoped lang="less">
.data-source {
  &__select {
    width: 100%;
  }
}
</style>
