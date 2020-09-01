<template>
  <div class="CombineSelect">
    <a-form-model-item label="监控实体" v-bind="$props">
      <ModelEndpointSelect />
    </a-form-model-item>

    <a-form-model-item label="检查项" v-bind="$props">
      <ModelMetricSelect />
    </a-form-model-item>
  </div>
</template>

<script>
import {
  ModelEndpointSelect,
  ModelMetricSelect
} from './Model'
import { FormModel } from 'ant-design-vue'

export default {
  name: 'CombineSelect',
  extends: FormModel.Item,
  mixins: [],
  components: {
    ModelEndpointSelect,
    ModelMetricSelect
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
