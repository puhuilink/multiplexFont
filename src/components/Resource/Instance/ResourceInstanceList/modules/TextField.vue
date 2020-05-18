<template>
  <a-form-item
    :label="field.label"
    v-bind="formItemProps"
    style="width: 100%"
  >
    <a-input
      v-if="dataType === 'STRING'"
      allowClear
      v-model.trim="field.value"
    />
    <a-input-number
      v-else
      allowClear
      v-model.number="field.value"
      style="width: 100%"
    />
  </a-form-item>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'TextField',
  mixins: [mixin],
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
