<template>
  <a-form-model-item v-bind="$props">
    <a-select
      style="min-width: 100px"
      class="fw"
      placeholder="等于（或大于、小于...）"
    >
      <a-select-option
        v-for="operator in ['=', '>', '>=', '<', '<=']"
        :key="operator"
        :value="operator"
      >{{ operator }}</a-select-option>
    </a-select>
  </a-form-model-item>
</template>

<script>
import { FormModel } from 'ant-design-vue'

export default {
  name: 'ThresholdOperatorSelect',
  extends: FormModel.Item,
  mixins: [],
  components: {},
  props: {},
  data: () => ({
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
