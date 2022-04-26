<template>
  <div>
    <a-form-model-item
      label="接口类型"
    >
      <a-input
        v-model="model.apiType"
        @change="change()"
      />
    </a-form-model-item>
    <a-form-model-item
      label="请求类型"
    >
      <a-input
        v-model="model.requestType"
        @change="change()"
      />
    </a-form-model-item>
    <a-form-model-item label="站点ID" require>
      <a-input
        v-model="model.siteId"
        @change="change()"
      ></a-input>
    </a-form-model-item>
    <a-form-model-item label="目标站点ID">
      <a-input
        v-model="model.peerId"
        @change="change()"
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
    <a-form-model-item label="单位">
      <a-input
        v-model="model.unit"
        @change="change()"
      ></a-input>
    </a-form-model-item>
    <a-form-model-item
      label="选择状态类型"
      require
      v-if="stateSwitch"
    >
      <a-select
        :value="model.status"
        @change="statusChanged"
        mode="multiple"
      >
        <a-select-option value="active">激活</a-select-option>
        <a-select-option value="pending">等待</a-select-option>
        <a-select-option value="disabled">禁用</a-select-option>
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
    },
    stateSwitch: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    valueChanged (value) {
      this.model.type = value
    },
    statusChanged (value) {
      this.model.status = value
    }
  }
}
</script>

<style scoped>
</style>
