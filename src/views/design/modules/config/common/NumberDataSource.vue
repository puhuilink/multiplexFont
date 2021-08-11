<template>
  <a-form-model class="numberSource" v-bind="formItemLayout">
    <PreviewButton :preview="() => change(true)" />
    <a-form-model-item label="数据域">
      <OriginSelect
        mode="multiple"
        v-model="numberConfig.location"
        @change="change()"
      ></OriginSelect>
    </a-form-model-item>
    <RefreshTime @change="change()" />
  </a-form-model>
</template>

<script>
import { OriginSelect } from '@/components/Alarm'
import DataSourceMixins from '@/views/design/modules/config/dataSourceMixins'
export default {
  name: 'NumberDataSource',
  mixins: [DataSourceMixins],
  components: {
    OriginSelect
  }
}
</script>

<style lang="less">
  .numberSource {
    width: 100%;
  }
</style>
