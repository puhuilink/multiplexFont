<template>
  <a-form-model class="ormDataSource" v-bind="formItemLayout">
    <PreviewButton :preview="() => change(true)" />
    <a-form-model-item label="站点ID" require>
      <a-input
        v-model="siteCpeStatusConfig.siteId"
      ></a-input>
    </a-form-model-item>

    <a-form-model-item label="站点ID" require>
      <a-select
        :value="siteCpeStatusConfig.status"
      >
        <a-select-option value="hour">禁止</a-select-option>
        <a-select-option value="day">等待</a-select-option>
        <a-select-option value="week">活动</a-select-option>
      </a-select>
    </a-form-model-item>

    <RefreshTime @change="change()" />
  </a-form-model>
</template>

<script>
import DataSourceMixins from '@/views/design/modules/config/dataSourceMixins'

export default {
  name: 'CpeStatusDataSource',
  mixins: [DataSourceMixins]
}
</script>

<style scoped>

</style>
