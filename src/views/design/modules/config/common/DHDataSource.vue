<template>
  <a-form-model class="DHDataSource" v-bind="formItemLayout">
    <PreviewButton :preview="preview" />

    <a-form-item label="采集指标" required>
      <a-select allowClear class="fw" v-model="config.dataConfig.dbDataConfig.dhConfig.code">
        <a-select-option value="Temperature">温度</a-select-option>
        <a-select-option value="Humidity">湿度</a-select-option>
      </a-select>
    </a-form-item>

    <RefreshTime @change="change()" />
  </a-form-model>
</template>

<script>
import DataSourceMixins from '../dataSourceMixins/index'

export default {
  name: 'DHDataSource',
  mixins: [DataSourceMixins],
  components: {},
  props: {},
  data () {
    return {
      btnLoading: false
    }
  }
}
</script>

<style lang="less">

</style>
