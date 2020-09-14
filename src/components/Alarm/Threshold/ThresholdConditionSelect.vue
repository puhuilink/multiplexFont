<template>
  <a-form-model-item v-bind="$props">
    <a-select
      class="fw"
      style="min-width: 120px;"
      placeholder="等于（或大于、小于...）"
      :value="value"
      @select="$emit('input', $event)"
    >
      <a-select-option
        v-for="condition in ['连续发生', '发生次数', '最大值', '最小值', '求和', '突增突降', '突增突降率']"
        :key="condition"
        :value="condition"
      >{{ condition }}</a-select-option>
    </a-select>
  </a-form-model-item>
</template>

<script>
import { FormModel } from 'ant-design-vue'

export default {
  name: 'ThresholdConditionSelect',
  mixins: [],
  components: {},
  props: {
    ...FormModel.Item.props,
    value: {
      type: String,
      default: ''
    }
  },
  data: () => ({
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
