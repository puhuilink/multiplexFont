<template>
  <div class="ComplexSnippet">
    <a-form-model-item label="监控对象" v-bind="$props">
      <ComplexSelect v-model="model" />
    </a-form-model-item>

    <a-form-model-item label="监控实体" v-bind="$props">
      <ModelEndpointSelect
        :parentId="model.deviceModel"
        v-model="model.endpointId"
      />
    </a-form-model-item>

    <a-form-model-item label="检查项" v-bind="$props">
      <ModelMetricSelect
        :parentId="model.endpointId"
        v-model="model.metricId"
      />
    </a-form-model-item>

  </div>
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
