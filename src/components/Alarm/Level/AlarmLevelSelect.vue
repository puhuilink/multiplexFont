<template>
  <a-form-model-item label="告警级别" v-bind="$props">
    <a-select
      allowClear
      style="min-width: 80px"
      class="fw"
      :disabled="disabled"
      :value="value"
      @select="$emit('input', $event)"
      @change="$emit('change', $event)"
    >
      <a-select-option
        v-for="level in [1, 2, 3, 4, 5]"
        :key="level"
        :value="level"
        :disabled="optionDisabled(level)"
      >{{ `L${level}` }}</a-select-option>
    </a-select>
  </a-form-model-item>
</template>

<script>
import { FormModel } from 'ant-design-vue'

export default {
  name: 'AlarmLevelSelect',
  mixins: [],
  components: {},
  props: {
    ...FormModel.Item.props,
    disabled: {
      type: Boolean,
      default: false
    },
    optionDisabled: {
      type: Function,
      default: () => false
    },
    value: {
      type: Number,
      default: undefined
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
