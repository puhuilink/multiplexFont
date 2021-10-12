<template>
  <a-form-model class="NUMSource" v-bind="formItemLayout">
    <PreviewButton :preview="preview" />
    <a-form-item label="SQL" required>
      <a-textarea
        v-model="config.dataConfig.dbDataConfig.sqlConfig.sql"
        placeholder="请输入sql"
        :auto-size="{ minRows: 5, maxRows: 10 }"
        @blur="change()"
      />
    </a-form-item>
    <RefreshTime @change="change()" />
  </a-form-model>
</template>

<script>
import DataSourceMixins from '@/views/design/modules/config/dataSourceMixins'

export default {
  name: 'SQLDataSource',
  mixins: [DataSourceMixins]
}
</script>

<style lang="less">
  .numberSource {
    width: 100%;
    &__editor {
      border-radius: 4px;
      background: #f1f1f1;
      font-size: 14px;
    }
  }
</style>
