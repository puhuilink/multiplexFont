<template>
  <a-form-model-item label="告警级别" v-bind="$props">
    <a-select
      allowClear
      style="min-width: 80px"
      class="fw"
      :disabled="disabled"
      :mode="mode"
      :value="value"
      @change="e => {
        $emit('input', e)
        $emit('change', e)
      }"
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
import { FormModel, Select } from 'ant-design-vue'

export default {
  name: 'AlarmLevelSelect',
  mixins: [],
  components: {},
  props: {
    ...FormModel.Item.props,
    // eslint-disable-next-line vue/require-default-prop
    mode: Select.props.mode,
    disabled: {
      type: Boolean,
      default: false
    },
    optionDisabled: {
      type: Function,
      default: () => false
    },
    value: {
      type: [Number, Array],
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
