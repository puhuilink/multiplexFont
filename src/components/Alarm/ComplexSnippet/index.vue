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
      prop="endpointId"
      :rules="[
        { required: true, message: '请选择监控实体' }
      ]">
      <ModelEndpointSelect
        :parentId="model.deviceModel"
        v-model="model.endpointId"
      />
    </a-form-model-item>

    <a-form-model-item
      v-bind="$props"
      label="检查项"
      prop="metricId"
      :rules="[
        { required: true, message: '请选择检查项' }
      ]">
      <ModelMetricSelect
        :parentId="model.endpointId"
        v-model="model.metricId"
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
