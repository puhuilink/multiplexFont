<template>
  <div class="CombineSelect">
    <a-form-model-item label="监控对象" v-bind="$props">
      <a-select></a-select>
    </a-form-model-item>

    <a-form-model-item label="监控实体" v-bind="$props">
      <EndpointSelect schema="model" />
    </a-form-model-item>

    <a-form-model-item label="检查项" v-bind="$props">
      <MetricSelect schema="model" />
    </a-form-model-item>
  </div>
</template>

<script>
import { FormModel } from 'ant-design-vue'
import EndpointSelect from '~~~/ResourceConfig/Endpoint'
import MetricSelect from '~~~/ResourceConfig/Metric'

export default {
  name: 'CombineSelect',
  extends: FormModel.Item,
  mixins: [],
  components: {
    EndpointSelect,
    MetricSelect
  },
  props: {},
  data: () => ({
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
