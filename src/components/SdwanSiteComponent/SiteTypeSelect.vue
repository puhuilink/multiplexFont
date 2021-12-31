<template>
  <div>
    <a-form-model-item label="站点ID" require>
      <a-input
        v-model="model.siteId"
      ></a-input>
    </a-form-model-item>
    <a-form-model-item label="选择时间类型" require>
      <a-select
        :value="model.type"
        @change="valueChanged"
      >
        <a-select-option value="hour">一小时</a-select-option>
        <a-select-option value="day">一天</a-select-option>
        <a-select-option value="week">一周</a-select-option>
        <a-select-option value="month">一月</a-select-option>
      </a-select>
    </a-form-model-item>
  </div>
</template>

<script>
import DataSourceMixins from '@/views/design/modules/config/dataSourceMixins'

export default {
  name: 'SiteTypeSelect',
  mixins: [DataSourceMixins],
  props: {
    model: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    valueChanged (value) {
      this.model.type = value
    }
  }
}
</script>

<style scoped>
</style>
