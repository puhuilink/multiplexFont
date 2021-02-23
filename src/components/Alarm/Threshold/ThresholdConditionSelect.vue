<template>
  <a-form-model-item v-bind="$props">
    <a-select
      class="fw"
      style="min-width: 120px"
      placeholder="等于（或大于、小于...）"
      :disabled="disabled"
      :value="value"
      @select="$emit('input', $event)"
    >
      <a-select-option v-for="condition in conditionList" :key="condition.value" :value="condition.value">{{
        condition.label
      }}</a-select-option>
    </a-select>
  </a-form-model-item>
</template>

<script>
import { FormModel } from 'ant-design-vue'
import bus from '@/utils/bus'
export default {
  name: 'ThresholdConditionSelect',
  mixins: [],
  components: {},
  props: {
    ...FormModel.Item.props,
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    setSelect: '',
    conditionList: [
      { label: '连续发生', value: 'all' },
      { label: '发生次数', value: 'happen' },
      { label: '最大值', value: 'max' },
      { label: '最小值', value: 'min' },
      { label: '均值', value: 'avg' },
      { label: '求和', value: 'sum' },
      { label: '突增突降', value: 'diff' },
      { label: '突增突降率', value: 'pdiff' }
    ]
  }),
  computed: {
    setSelectVal () {
      return this.value
    }
  },
  watch: {
    setSelectVal: (newV, oldV) => {
      bus.$emit('sel', newV)
    }
  },
  methods: {}
}
</script>

<style lang="less">
</style>
