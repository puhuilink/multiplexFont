<template>
  <fragment>
    <a-form-model-item
      v-bind="$props"
      label="监控对象"
      prop="deviceModel"
      :rules="[
        { required: true, message: '请选择监控对象' }
      ]">
      <ComplexSelect v-model="model" />
    </a-form-model-item>

    <a-form-model-item
      v-bind="$props"
      label="监控实体"
      prop="endpointModelId"
      :rules="[
        { required: true, message: '请选择监控实体' }
      ]">
      <ModelEndpointSelect
        v-bind="ctx && ctx.editAbleProps"
        :parentId="model.deviceModel"
        v-model="model.endpointModelId"
      />
    </a-form-model-item>

    <a-form-model-item
      v-bind="$props"
      label="检查项"
      prop="metricModelId"
      :rules="[
        { required: true, message: '请选择检查项' }
      ]">
      <ModelMetricSelect
        v-bind="ctx && ctx.editAbleProps"
        :parentId="model.endpointModelId"
        v-model="model.metricModelId"
      />
    </a-form-model-item>

  </fragment>
</template>

<script>
import ComplexSelect from '../ComplexSelect'
import { ModelEndpointSelect, ModelMetricSelect } from '~~~/Resource'
import { FormModel } from 'ant-design-vue'

export default {
  name: 'ComplexSnippet',
  mixins: [],
  components: {
    ComplexSelect,
    ModelEndpointSelect,
    ModelMetricSelect
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
