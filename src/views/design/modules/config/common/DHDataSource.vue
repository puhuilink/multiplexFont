<template>
  <div class="DHDataSource">
    <a-form-item v-bind="formItemLayout">
      <a-button
        :disabled="!dhConfig.code"
        :loading="btnLoading"
        @click="preview"
      >预览</a-button>
    </a-form-item>

    <a-form-item label="采集指标" v-bind="formItemLayout">
      <a-select allowClear class="fw" v-model="dhConfig.code">
        <a-select-option value="Temperature">温度</a-select-option>
        <a-select-option value="Humidity">湿度</a-select-option>
      </a-select>
    </a-form-item>

    <RefreshTime />
  </div>
</template>

<script>
import DataSourceMixins from '../dataSourceMixins/index'
import RefreshTime from './RefreshTime'

export default {
  name: 'DHDataSource',
  mixins: [DataSourceMixins],
  components: {
    RefreshTime
  },
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
