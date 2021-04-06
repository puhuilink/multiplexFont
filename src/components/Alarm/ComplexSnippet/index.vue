<template>
  <fragment>
    <a-form-model-item
      v-bind="$props"
      label="监控对象"
      prop="deviceBrand"
      :rules="[
        { required: true, message: '请选择监控对象' }
      ]">
      <ComplexSelect v-model="model" />
    </a-form-model-item>

    <a-form-model-item
      v-bind="$props"
      label="监控实体"
      prop="endpointModelId"
      >
      <EndpointSelect
        schema="model"
        v-bind="ctx && ctx.editAbleProps"
        :parentId="model.deviceModel"
        v-model="model.endpointModelId"
      />
    </a-form-model-item>

    <a-form-model-item
      v-bind="$props"
      label="检查项"
      prop="metricModelId"
      >
      <MetricSelect
        schema="model"
        v-bind="ctx && ctx.editAbleProps"
        :parentId="model.endpointModelId"
        v-model="model.metricModelId"
      />
    </a-form-model-item>

  </fragment>
</template>

<script>
import ComplexSelect from '~~~/ResourceConfig/Device/index'
import { FormModel } from 'ant-design-vue'
import EndpointSelect from '~~~/ResourceConfig/Endpoint'
import MetricSelect from '~~~/ResourceConfig/Metric'

export default {
  name: 'ComplexSnippet',
  mixins: [],
  components: {
    ComplexSelect,
    EndpointSelect,
    MetricSelect
  },
  props: {
    ...FormModel.Item.props,
    value: {
      type: Object,
      default: () => ({})
    }
  },
  inject: {
    ctx: {
      default: () => ({})
    }
  },
  data: () => ({}),
  computed: {
    model: {
      get () {
        return this.value
      },
      set (model) {
        this.$emit('input', model)
      }
    }
  },
  methods: {}
}
</script>

<style lang="less">

</style>
