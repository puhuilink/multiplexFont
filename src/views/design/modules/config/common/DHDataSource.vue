<template>
  <a-form-model class="DHDataSource" v-bind="formItemLayout">
    <a-form-item v-bind="formItemLayout">
      <a-button
        :disabled="!dhConfig.code"
        :loading="btnLoading"
        @click="preview"
      >预览</a-button>
    </a-form-item>

    <a-form-item label="采集指标">
      <a-select allowClear class="fw" v-model="dhConfig.code">
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
  },
  computed: {
    dhConfig () {
      return this.config.dataConfig.dbDataConfig.dhConfig
    }
  },
  methods: {
    async preview () {
      if (!this.dhConfig.code) return
      try {
        this.btnLoading = true
        await this.change(true)
      } finally {
        this.btnLoading = false
      }
    }
  }
}
</script>

<style lang="less">

</style>
