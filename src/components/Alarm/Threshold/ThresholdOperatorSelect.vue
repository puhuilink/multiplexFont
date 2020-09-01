<template>
  <div class="ThresholdOperatorSelect">
    <a-form-model-item class="fw" v-bind="$props">
      <a-select
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
  </div>
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
