<template>
  <a-form-model class="ormDataSource" v-bind="formItemLayout">
    <PreviewButton :preview="() => change(true)" />
    <a-form-model-item
      label="接口类型"
    >
      <a-input
        v-model="siteCpeConfig.apiType"
        @change="change()"
      /></a-form-model-item>
    <SiteTypeSelect
      :model.sync="siteCpeConfig"
    ></SiteTypeSelect>

    <RefreshTime @change="change()" />
  </a-form-model>
</template>

<script>
import DataSourceMixins from '@/views/design/modules/config/dataSourceMixins'
import SiteTypeSelect from '~~~/SdwanSiteComponent/SiteTypeSelect'

export default {
  name: 'CpeDataSource',
  mixins: [DataSourceMixins],
  components: {
    SiteTypeSelect
  }
}
</script>

<style scoped>

</style>
